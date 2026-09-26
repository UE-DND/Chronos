import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { MobilePluginServerDefinition } from '../../packages/core/src/types/plugin-server.ts';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import { resolveOfficialServerPlugin, type PluginLocation } from './server-definition.ts';

export interface ResolvedMobilePlugin {
	id: string;
	importPath: string;
	definition: MobilePluginServerDefinition & { allowedDomains: readonly string[] };
}

type PackageExports = Record<string, unknown>;

function exportedFile(packageDir: string, exports: PackageExports, key: string): string {
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

function validateDefinition(
	value: unknown,
	pluginId: string,
	serverAction: string,
	allowedDomains: readonly string[]
): MobilePluginServerDefinition & { allowedDomains: readonly string[] } {
	if (!value || typeof value !== 'object') throw new Error('Missing mobilePluginDefinition export');
	const candidate = value as Partial<MobilePluginServerDefinition>;
	if (candidate.pluginId !== pluginId) {
		throw new Error(`mobilePluginDefinition.pluginId must be ${pluginId}`);
	}
	if (!Array.isArray(candidate.actions) || candidate.actions.length === 0) {
		throw new Error('mobilePluginDefinition.actions must be a non-empty array');
	}
	const actions = new Set<string>();
	for (const action of candidate.actions) {
		if (typeof action !== 'string' || !/^[a-z][a-z0-9_-]*$/.test(action)) {
			throw new Error('mobilePluginDefinition.actions must contain valid action names');
		}
		if (actions.has(action)) throw new Error(`Duplicate mobile plugin action: ${action}`);
		actions.add(action);
		if (action !== serverAction) {
			throw new Error(
				`mobilePluginDefinition.actions must match serverDefinition.proxy.action (${serverAction})`
			);
		}
	}
	if (!actions.has(serverAction)) {
		throw new Error(
			`mobilePluginDefinition.actions must match serverDefinition.proxy.action (${serverAction})`
		);
	}
	if (!Array.isArray(candidate.cookieOrigins)) {
		throw new Error('mobilePluginDefinition.cookieOrigins must be an array');
	}
	const cookieOrigins = new Set<string>();
	for (const origin of candidate.cookieOrigins) {
		if (typeof origin !== 'string') {
			throw new Error('mobilePluginDefinition.cookieOrigins must contain HTTPS origins');
		}
		let parsed: URL;
		try {
			parsed = new URL(origin);
		} catch {
			throw new Error(`Invalid mobile cookie origin: ${origin}`);
		}
		const domain = parsed.hostname.toLowerCase();
		if (
			parsed.protocol !== 'https:' ||
			parsed.username ||
			parsed.password ||
			parsed.pathname !== '/' ||
			parsed.search ||
			parsed.hash ||
			!allowedDomains.some((allowed) => domain === allowed || domain.endsWith(`.${allowed}`))
		) {
			throw new Error(`HTTPS cookie origin must belong to a declared proxy domain: ${origin}`);
		}
		if (cookieOrigins.has(parsed.origin)) {
			throw new Error(`Duplicate mobile cookie origin: ${parsed.origin}`);
		}
		cookieOrigins.add(parsed.origin);
	}
	return {
		pluginId,
		actions: [...actions],
		allowedDomains: [...allowedDomains],
		cookieOrigins: [...cookieOrigins]
	};
}

type MobilePluginLocation = PluginLocation;

/** Resolve optional package-owned mobile handlers without importing their runtime module. */
export async function resolveOfficialMobilePlugin(
	plugin: MobilePluginLocation,
	root: string
): Promise<ResolvedMobilePlugin | null> {
	const packageDir = resolve(root, 'packages/plugins', plugin.sourceDir);
	const packageJsonPath = resolve(packageDir, 'package.json');
	if (!existsSync(packageJsonPath)) throw new Error(`${plugin.id}: missing package.json`);
	const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
		name?: unknown;
		exports?: PackageExports;
	};
	const exports = pkg.exports ?? {};
	const hasMobile = Object.hasOwn(exports, './mobile');
	const hasDefinition = Object.hasOwn(exports, './mobile/definition');
	if (!hasMobile && !hasDefinition) return null;
	if (!hasMobile || !hasDefinition) {
		throw new Error(`${plugin.id}: mobile and mobile/definition exports must be declared together`);
	}
	if (typeof pkg.name !== 'string' || !/^@[^/]+\/[^/]+$/.test(pkg.name)) {
		throw new Error(`${plugin.id}: invalid package name`);
	}
	exportedFile(packageDir, exports, './mobile');
	const definitionFile = exportedFile(packageDir, exports, './mobile/definition');
	const serverPlugin = await resolveOfficialServerPlugin(plugin, root, true);
	if (!serverPlugin) throw new Error(`${plugin.id}: mobile handlers require a server definition`);
	const digest = createHash('sha256').update(readFileSync(definitionFile)).digest('hex');
	const module = await import(`${pathToFileURL(definitionFile).href}?rev=${digest}`);
	return {
		id: plugin.id,
		importPath: `${pkg.name}/mobile`,
		definition: validateDefinition(
			module.mobilePluginDefinition,
			plugin.id,
			serverPlugin.definition.proxy.action,
			serverPlugin.definition.proxy.domains
		)
	};
}

export async function resolveOfficialMobilePlugins(
	root: string,
	catalog: readonly Pick<OfficialPluginDef, 'id' | 'sourceDir'>[] = OFFICIAL_PLUGINS
): Promise<ResolvedMobilePlugin[]> {
	const selected = new Set<string>();
	const result: ResolvedMobilePlugin[] = [];
	for (const plugin of catalog) {
		if (selected.has(plugin.id)) throw new Error(`Duplicate mobile plugin: ${plugin.id}`);
		selected.add(plugin.id);
		const resolved = await resolveOfficialMobilePlugin(plugin, root);
		if (resolved) result.push(resolved);
	}
	return result;
}
