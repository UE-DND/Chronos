import { existsSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import type { Logger, Plugin, ViteDevServer } from 'vite';
import type { OfficialPluginDef } from '../../../../../scripts/official-plugins.config.ts';
import { PluginBuildCoordinator } from '../../../../../scripts/official-plugin-build/coordinator.ts';
import { createOfficialPluginBuildPaths } from '../../../../../scripts/official-plugin-build/paths.ts';
import {
	readHostBuildContext,
	writeHostBuildContext
} from '../../../../../scripts/official-plugin-build/host-context.ts';
import { declaredDevelopmentLicenses } from '../legal/dev-licenses.ts';
import { formatThirdPartyLicenses } from '../legal/third-party-license-generator.ts';
import {
	buildOfficialPluginAssets,
	type OfficialPluginBuildResult
} from '../../../../../scripts/official-plugin-build/build-plugin.ts';
import { createDevOfficialPluginBundleMiddleware } from '../../../../../scripts/official-plugin-build/dev-bundle-middleware.ts';
import { loadDevPluginBuildPayload } from '../../../../../scripts/official-plugin-build/load-dev-build-payload.ts';
import type { OfficialPluginBuildPaths } from '../../../../../scripts/official-plugin-build/paths.ts';

const DEV_PLUGIN_HMR_BOOTSTRAP_PATH = '/__chronos/dev-plugin-hmr.json';

export type PluginHmrPayload = OfficialPluginBuildResult;

export interface ChronosPluginHmrOptions {
	monorepoRoot: string;
	plugins: OfficialPluginDef[];
	createAliasRecord: (root?: string) => Record<string, string>;
	hostVersion?: string;
}

function formatPluginHmrPath(rootDir: string, filePath: string): string {
	return relative(rootDir, filePath).replace(/\\/g, '/');
}

function logPluginHmrInfo(logger: Logger, message: string): void {
	logger.info(`(plugin) ${message}`, { timestamp: true });
}

function logPluginHmrError(logger: Logger, message: string): void {
	logger.error(`(plugin) ${message}`, { timestamp: true });
}

function resolveHostVersion(monorepoRoot: string, override?: string): string {
	if (override) return override;
	const packageJson = JSON.parse(
		readFileSync(resolve(monorepoRoot, 'apps/web/package.json'), 'utf8')
	) as { version: string };
	return packageJson.version;
}

export async function buildSingleOfficialPlugin(
	plugin: OfficialPluginDef,
	root: string,
	createAliasRecord: (root?: string) => Record<string, string>,
	releaseVersion = '0.0.0-dev',
	_logger?: Logger,
	rev?: string,
	paths?: OfficialPluginBuildPaths
): Promise<PluginHmrPayload> {
	return buildOfficialPluginAssets(plugin, {
		root,
		releaseVersion,
		createAliasRecord,
		mode: 'dev',
		rev,
		paths
	});
}

function publicPayload(payload: PluginHmrPayload) {
	const {
		inputs: _inputs,
		licenses: _licenses,
		cacheStatus: _cacheStatus,
		wallpaperBytes: _wallpaper,
		...data
	} = payload;
	return data;
}

function sendPluginHmrUpdate(
	server: ViteDevServer,
	payload: PluginHmrPayload,
	costMs: string
): void {
	server.ws.send({
		type: 'custom',
		event: 'chronos:plugin-hmr',
		data: {
			...publicPayload(payload),
			costMs
		}
	});
}

export function chronosPluginHmrPlugin(options: ChronosPluginHmrOptions): Plugin {
	const { monorepoRoot, plugins, createAliasRecord, hostVersion } = options;

	const resolvedHostVersion = resolveHostVersion(monorepoRoot, hostVersion);

	return {
		name: 'chronos-plugin-hmr',
		apply: 'serve',
		async configureServer(server) {
			if (process.env.VITEST) return;
			const logger = server.config.logger;
			const context = readHostBuildContext();
			const coordinator = new PluginBuildCoordinator({
				root: monorepoRoot,
				plugins,
				mode: 'dev',
				releaseVersion: resolvedHostVersion,
				createAliasRecord,
				environment: context?.environment
			});
			const latest = new Map<string, PluginHmrPayload>();
			let disposed = false;
			const refreshHost = () => {
				if (context) writeHostBuildContext(monorepoRoot, context, [...latest.values()]);
			};
			server.middlewares.use((req, res, next) => {
				if (req.url?.split('?')[0] !== '/licenses/third-party.json') {
					next();
					return;
				}
				try {
					const deps = [
						...declaredDevelopmentLicenses(monorepoRoot),
						...[...latest.values()].flatMap((result) => result.licenses ?? [])
					];
					res.setHeader('Content-Type', 'application/json; charset=utf-8');
					res.setHeader('Cache-Control', 'no-store');
					res.end(JSON.stringify(formatThirdPartyLicenses(deps)));
				} catch (error) {
					next(error);
				}
			});
			const pluginsDir = resolve(monorepoRoot, 'packages/plugins');
			server.watcher.add(pluginsDir);
			server.middlewares.use(createDevOfficialPluginBundleMiddleware(monorepoRoot));
			server.middlewares.use((req, res, next) => {
				const url = req.url?.split('?')[0] ?? '';
				if (url !== DEV_PLUGIN_HMR_BOOTSTRAP_PATH) {
					next();
					return;
				}

				const payloads = plugins
					.map((plugin) => loadDevPluginBuildPayload(plugin, monorepoRoot))
					.filter((payload): payload is PluginHmrPayload => payload != null)
					.map((payload) => ({
						...publicPayload(payload),
						costMs: '0'
					}));

				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json; charset=utf-8');
				res.setHeader('Cache-Control', 'no-cache');
				res.end(JSON.stringify(payloads));
			});

			const warmStart = performance.now();
			const initial = await coordinator.prepare();
			for (const payload of initial) latest.set(payload.id, payload);
			refreshHost();
			const paths = createOfficialPluginBuildPaths(monorepoRoot);
			for (const payload of initial) {
				const dir = paths.devOutDir(payload.id);
				if (existsSync(dir))
					for (const entry of readdirSync(dir, { withFileTypes: true })) {
						if (entry.isDirectory() && entry.name !== payload.rev)
							rmSync(resolve(dir, entry.name), { recursive: true, force: true });
					}
			}
			logPluginHmrInfo(
				logger,
				`official plugin dev builds ready in ${(performance.now() - warmStart).toFixed(1)}ms`
			);

			const pendingTimers = new Map<string, NodeJS.Timeout>();
			const inFlightBuilds = new Set<string>();
			const queuedRebuilds = new Set<string>();
			const triggerFiles = new Map<string, string>();

			const executeBuild = async (pluginDef: OfficialPluginDef) => {
				if (disposed) return;
				if (inFlightBuilds.has(pluginDef.id)) {
					queuedRebuilds.add(pluginDef.id);
					return;
				}

				inFlightBuilds.add(pluginDef.id);
				try {
					do {
						queuedRebuilds.delete(pluginDef.id);
						const startTime = performance.now();
						const triggerFile = triggerFiles.get(pluginDef.id);
						try {
							const [payload] = await coordinator.prepare([pluginDef.id]);
							if (disposed) return;
							const previous = latest.get(payload.id);
							latest.set(payload.id, payload);
							refreshHost();
							if (previous?.rev === payload.rev) continue;

							const costMs = (performance.now() - startTime).toFixed(1);
							sendPluginHmrUpdate(server, payload, costMs);
							const hmrMessage = triggerFile
								? `hmr update ${formatPluginHmrPath(server.config.root, triggerFile)} → ${pluginDef.id}@${payload.rev ?? '?'} in ${costMs}ms`
								: `hmr update ${pluginDef.id}@${payload.rev ?? '?'} in ${costMs}ms`;
							logPluginHmrInfo(logger, hmrMessage);
						} catch (err: unknown) {
							if (disposed) return;
							const error = err instanceof Error ? err : new Error(String(err));
							const triggerSuffix = triggerFile
								? ` (${formatPluginHmrPath(server.config.root, triggerFile)})`
								: '';
							logPluginHmrError(
								logger,
								`hmr error ${pluginDef.id}${triggerSuffix}: ${error.message}`
							);
							server.ws.send({
								type: 'custom',
								event: 'chronos:plugin-hmr-error',
								data: {
									id: pluginDef.id,
									message: error.message,
									stack: error.stack
								}
							});
						}
					} while (queuedRebuilds.has(pluginDef.id));
				} finally {
					inFlightBuilds.delete(pluginDef.id);
					triggerFiles.delete(pluginDef.id);
				}
			};

			const handleFileEvent = (filePath: string) => {
				if (disposed) return;
				for (const id of coordinator.affected(filePath)) {
					const pluginDef = plugins.find((plugin) => plugin.id === id)!;
					triggerFiles.set(id, filePath);
					const timer = pendingTimers.get(id);
					if (timer) clearTimeout(timer);
					pendingTimers.set(
						id,
						setTimeout(() => {
							pendingTimers.delete(id);
							void executeBuild(pluginDef);
						}, 100)
					);
				}
			};
			server.watcher.add([
				resolve(monorepoRoot, 'packages'),
				resolve(monorepoRoot, 'pnpm-lock.yaml')
			]);
			const dispose = () => {
				disposed = true;
				coordinator.dispose();
				for (const timer of pendingTimers.values()) clearTimeout(timer);
				pendingTimers.clear();
				queuedRebuilds.clear();
				server.watcher.off('change', handleFileEvent);
				server.watcher.off('add', handleFileEvent);
				server.watcher.off('unlink', handleFileEvent);
			};
			server.watcher.once('close', dispose);
			server.httpServer?.once('close', dispose);

			server.watcher.on('change', handleFileEvent);
			server.watcher.on('add', handleFileEvent);
			server.watcher.on('unlink', handleFileEvent);
		}
	};
}
