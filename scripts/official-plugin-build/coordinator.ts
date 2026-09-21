import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { OfficialPluginDef } from '../official-plugins.config.ts';
import { createChronosAliasRecord } from '../resolve-chronos-aliases.ts';
import { inputAffected, canonicalPath } from './cache.ts';
import {
	buildOfficialPluginAssets,
	type OfficialPluginBuildMode,
	type OfficialPluginBuildResult
} from './build-plugin.ts';

export class PluginBuildCoordinator {
	private readonly abort = new AbortController();
	private readonly failed = new Set<string>();
	private readonly results = new Map<string, OfficialPluginBuildResult>();
	private readonly running = new Map<string, Promise<OfficialPluginBuildResult>>();
	private readonly waiting: Array<() => void> = [];
	private active = 0;
	private readonly options: {
		root: string;
		plugins: OfficialPluginDef[];
		mode: OfficialPluginBuildMode;
		releaseVersion?: string;
		createAliasRecord?: (root?: string) => Record<string, string>;
		environment?: Record<string, string>;
	};
	constructor(options: {
		root: string;
		plugins: OfficialPluginDef[];
		mode: OfficialPluginBuildMode;
		releaseVersion?: string;
		createAliasRecord?: (root?: string) => Record<string, string>;
		environment?: Record<string, string>;
	}) {
		this.options = options;
	}

	affected(path: string): string[] {
		const global =
			path === resolve(this.options.root, 'pnpm-lock.yaml') ||
			[
				resolve(this.options.root, 'package.json'),
				resolve(this.options.root, 'apps/web/package.json')
			].includes(path) ||
			/^packages\/(?:[^/]+|plugins\/[^/]+)\/package\.json$/.test(
				path.slice(this.options.root.length + 1)
			) ||
			path.startsWith(resolve(this.options.root, 'scripts') + '/');
		return this.options.plugins
			.filter(
				(plugin) =>
					global ||
					(this.failed.has(plugin.id) &&
						inputAffected(
							{
								files: {},
								directories: {},
								scans: {
									[canonicalPath(resolve(this.options.root, 'packages'))]: '',
									[canonicalPath(resolve(this.options.root, 'packages/plugins', plugin.sourceDir))]:
										''
								}
							},
							path
						)) ||
					(this.results.get(plugin.id)?.inputs &&
						inputAffected(this.results.get(plugin.id)!.inputs!, path))
			)
			.map((plugin) => plugin.id);
	}
	private async acquire(): Promise<void> {
		if (this.active < 2) {
			this.active++;
			return;
		}
		await new Promise<void>((done) => this.waiting.push(done));
	}
	private release(): void {
		const next = this.waiting.shift();
		if (next) next();
		else this.active--;
	}
	prepare(
		ids = this.options.plugins.map((plugin) => plugin.id)
	): Promise<OfficialPluginBuildResult[]> {
		return Promise.all(ids.map((id) => this.build(id)));
	}
	private build(id: string): Promise<OfficialPluginBuildResult> {
		const previous = this.running.get(id);
		if (previous) return previous;
		const plugin = this.options.plugins.find((item) => item.id === id);
		if (!plugin) return Promise.reject(new Error(`Unknown official plugin: ${id}`));
		const promise = (async () => {
			await this.acquire();
			try {
				this.abort.signal.throwIfAborted();
				const result = await buildOfficialPluginAssets(plugin, {
					...this.options,
					releaseVersion:
						this.options.releaseVersion ??
						(JSON.parse(readFileSync(resolve(this.options.root, 'apps/web/package.json'), 'utf8'))
							.version as string),
					createAliasRecord: this.options.createAliasRecord ?? createChronosAliasRecord,
					publish: false,
					signal: this.abort.signal
				});
				this.failed.delete(id);
				this.results.set(id, result);
				return result;
			} catch (error) {
				this.failed.add(id);
				throw error;
			} finally {
				this.release();
			}
		})().finally(() => this.running.delete(id));
		this.running.set(id, promise);
		return promise;
	}
	dispose(): void {
		this.abort.abort();
	}
}
