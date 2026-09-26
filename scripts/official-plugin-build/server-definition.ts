import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { PluginServerDefinition } from '../../packages/core/src/types/plugin-server.ts';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';

export type PluginLocation = Pick<OfficialPluginDef, 'id' | 'sourceDir'>;

export interface ResolvedServerPlugin {
	id: string;
	importPath: string;
	definition: PluginServerDefinition;
}

function exportedFile(packageDir: string, exports: Record<string, unknown>, key: string): string {
	const entry = exports[key];
	const target =
		typeof entry === 'string'
			? entry
			: entry && typeof entry === 'object'
				? (entry as { import?: unknown }).import
				: undefined;
	if (typeof target !== 'string' || !target.startsWith('./')) {
		throw new Error(`Invalid ${key} package export`);
	}
	const file = resolve(packageDir, target);
	const inside = relative(packageDir, file);
	if (!inside || inside === '..' || inside.startsWith('../') || inside.startsWith('..\\')) {
		throw new Error(`Invalid ${key} package export target`);
	}
	if (!existsSync(file)) throw new Error(`Missing ${key} package export target: ${file}`);
	return file;
}

function validateDefinition(value: unknown, pluginId: string): PluginServerDefinition {
	if (!value || typeof value !== 'object') throw new Error('Missing serverDefinition export');
	const definition = value as Partial<PluginServerDefinition>;
	if (definition.pluginId !== pluginId) {
		throw new Error(`serverDefinition.pluginId must be ${pluginId}`);
	}
	const proxy = definition.proxy;
	if (!proxy || typeof proxy.action !== 'string' || !/^[a-z][a-z0-9_-]*$/.test(proxy.action)) {
		throw new Error('serverDefinition.proxy.action must be a single URL segment');
	}
	if (!Array.isArray(proxy.domains) || proxy.domains.length === 0) {
		throw new Error('serverDefinition.proxy.domains must be a non-empty array');
	}
	const domains = new Set<string>();
	for (const domain of proxy.domains) {
		if (
			typeof domain !== 'string' ||
			domain.length > 253 ||
			domain.split('.').length < 2 ||
			domain
				.split('.')
				.some((label) => label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label))
		) {
			throw new Error(`Invalid server proxy domain: ${String(domain)}`);
		}
		if (domains.has(domain)) throw new Error(`Duplicate server proxy domain: ${domain}`);
		domains.add(domain);
	}
	return { pluginId, proxy: { action: proxy.action, domains: [...domains] } };
}

/** Resolve package-owned server metadata without importing server handlers in Node. */
export async function resolveOfficialServerPlugin(
	plugin: PluginLocation,
	root: string,
	required = false
): Promise<ResolvedServerPlugin | null> {
	const packageDir = resolve(root, 'packages/plugins', plugin.sourceDir);
	const packageJsonPath = resolve(packageDir, 'package.json');
	if (!existsSync(packageJsonPath)) throw new Error(`${plugin.id}: missing package.json`);
	const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
		name?: unknown;
		exports?: Record<string, unknown>;
	};
	const exports = pkg.exports ?? {};
	const hasServer = Object.hasOwn(exports, './server');
	const hasDefinition = Object.hasOwn(exports, './server/definition');
	if (!hasServer && !hasDefinition) {
		if (required) throw new Error(`${plugin.id}: deployment requires a server plugin export`);
		return null;
	}
	if (!hasServer || !hasDefinition) {
		throw new Error(`${plugin.id}: server and server/definition exports must be declared together`);
	}
	if (typeof pkg.name !== 'string' || !/^@[^/]+\/[^/]+$/.test(pkg.name)) {
		throw new Error(`${plugin.id}: invalid package name`);
	}
	exportedFile(packageDir, exports, './server');
	const definitionFile = exportedFile(packageDir, exports, './server/definition');
	const digest = createHash('sha256').update(readFileSync(definitionFile)).digest('hex');
	const module = await import(`${pathToFileURL(definitionFile).href}?rev=${digest}`);
	return {
		id: plugin.id,
		importPath: `${pkg.name}/server`,
		definition: validateDefinition(module.serverDefinition, plugin.id)
	};
}

export async function resolveDeploymentServerPlugins(
	ids: readonly string[],
	root: string,
	catalog: readonly PluginLocation[] = OFFICIAL_PLUGINS
): Promise<ResolvedServerPlugin[]> {
	const selected = new Set<string>();
	const result: ResolvedServerPlugin[] = [];
	for (const id of ids) {
		if (selected.has(id)) throw new Error(`Duplicate server plugin in deployment: ${id}`);
		selected.add(id);
		const plugin = catalog.find((entry) => entry.id === id);
		if (!plugin) throw new Error(`Unknown server plugin in deployment: ${id}`);
		result.push((await resolveOfficialServerPlugin(plugin, root, true))!);
	}
	return result;
}
