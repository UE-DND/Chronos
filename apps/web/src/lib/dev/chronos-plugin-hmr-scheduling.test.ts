import { EventEmitter } from 'node:events';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import type { ViteDevServer } from 'vite';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { chronosPluginHmrPlugin } from './chronos-plugin-hmr-vite';
import { PluginBuildCoordinator } from '../../../../../scripts/official-plugin-build/coordinator.ts';
import * as hostContext from '../../../../../scripts/official-plugin-build/host-context.ts';
import type { OfficialPluginBuildResult } from '../../../../../scripts/official-plugin-build/build-plugin.ts';

let root = '';
let close: (() => void) | undefined;
afterEach(() => {
	close?.();
	close = undefined;
	vi.restoreAllMocks();
	vi.unstubAllEnvs();
	if (root) rmSync(root, { recursive: true, force: true });
});

function payload(id: string, rev = 'changed'): OfficialPluginBuildResult {
	return {
		id,
		rev,
		type: 'theme',
		code: rev,
		cssCode: null,
		colorsJson: null,
		iconThemeJson: null
	};
}

async function fixture() {
	root = mkdtempSync(resolve(tmpdir(), 'chronos-hmr-scheduling-'));
	vi.stubEnv('VITEST', '');
	vi.spyOn(hostContext, 'readHostBuildContext').mockReturnValue(undefined);
	const build = vi.fn(async (id: string) => payload(id));
	vi.spyOn(PluginBuildCoordinator.prototype, 'prepare').mockImplementation(async (ids) =>
		ids
			? Promise.all(ids.map((id) => build(id)))
			: ['alpha', 'beta'].map((id) => payload(id, 'initial'))
	);
	vi.spyOn(PluginBuildCoordinator.prototype, 'affected').mockImplementation((file) => [
		file.startsWith('alpha') ? 'alpha' : 'beta'
	]);
	const watcher = Object.assign(new EventEmitter(), { add: vi.fn() });
	const httpServer = new EventEmitter();
	const send =
		vi.fn<
			(event: { event: string; data: Pick<OfficialPluginBuildResult, 'id' | 'rev'> }) => void
		>();
	const error = vi.fn();
	const server = {
		config: { root, logger: { info: vi.fn(), error } },
		watcher,
		httpServer,
		middlewares: { use: vi.fn() },
		ws: { send }
	} as unknown as ViteDevServer;
	const plugin = chronosPluginHmrPlugin({
		monorepoRoot: root,
		plugins: ['alpha', 'beta'].map((id) => ({
			id,
			type: 'theme',
			sourceDir: id,
			name: { en: id },
			description: {}
		})),
		createAliasRecord: () => ({}),
		hostVersion: '0.0.0-test'
	});
	const configure = plugin.configureServer;
	if (typeof configure !== 'function') throw new Error('Expected a configureServer hook');
	await configure.call({} as never, server);
	close = () => {
		watcher.emit('close');
		httpServer.emit('close');
	};
	return { watcher, httpServer, build, send, error };
}

describe('plugin HMR scheduling', () => {
	it('coalesces a file burst per plugin without suppressing another plugin', async () => {
		const { watcher, build, send } = await fixture();
		watcher.emit('change', 'alpha/first.ts');
		watcher.emit('add', 'alpha/second.ts');
		watcher.emit('unlink', 'alpha/third.ts');
		watcher.emit('change', 'beta/first.ts');
		await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));
		await wait(150);
		expect(build.mock.calls.map(([id]) => id).sort()).toEqual(['alpha', 'beta']);
		expect(send.mock.calls.map(([event]) => event.data.id).sort()).toEqual(['alpha', 'beta']);
	});

	it('rebuilds after changes during a running build without overlapping it', async () => {
		const { watcher, build, send } = await fixture();
		const first = Promise.withResolvers<OfficialPluginBuildResult>();
		build.mockImplementationOnce(() => first.promise);
		watcher.emit('change', 'alpha/first.ts');
		await vi.waitFor(() => expect(build).toHaveBeenCalledTimes(1));
		watcher.emit('change', 'alpha/second.ts');
		watcher.emit('change', 'alpha/third.ts');
		await wait(150);
		expect(build).toHaveBeenCalledTimes(1);
		first.resolve(payload('alpha', 'first'));
		await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));
		expect(build).toHaveBeenCalledTimes(2);
		expect(send.mock.calls.map(([event]) => event.data.rev)).toEqual(['first', 'changed']);
	});

	it('keeps the last good revision on failure and only pushes changed builds', async () => {
		const { watcher, build, send, error } = await fixture();
		build.mockRejectedValueOnce(new Error('compile failed'));
		watcher.emit('change', 'alpha/first.ts');
		await vi.waitFor(() => expect(error).toHaveBeenCalledTimes(1));
		expect(send.mock.calls[0][0].event).toBe('chronos:plugin-hmr-error');
		build.mockResolvedValueOnce(payload('alpha', 'initial'));
		watcher.emit('change', 'alpha/reverted.ts');
		await vi.waitFor(() => expect(build).toHaveBeenCalledTimes(2));
		await wait(150);
		expect(send).toHaveBeenCalledTimes(1);
		watcher.emit('change', 'alpha/recovered.ts');
		await vi.waitFor(() => expect(send).toHaveBeenCalledTimes(2));
		expect(send.mock.calls[1][0].data.rev).toBe('changed');
	});

	it.each(['watcher', 'httpServer'] as const)(
		'cancels pending work when %s closes',
		async (source) => {
			const state = await fixture();
			state.watcher.emit('change', 'alpha/first.ts');
			state[source].emit('close');
			close?.();
			state.watcher.emit('change', 'alpha/after-close.ts');
			await wait(150);
			expect(state.build).not.toHaveBeenCalled();
			expect(state.send).not.toHaveBeenCalled();
			expect(state.error).not.toHaveBeenCalled();
		}
	);

	it.each(['success', 'failure'] as const)(
		'does not publish a running build’s %s after close',
		async (outcome) => {
			const { watcher, build, send, error } = await fixture();
			const running = Promise.withResolvers<OfficialPluginBuildResult>();
			build.mockImplementationOnce(() => running.promise);
			watcher.emit('change', 'alpha/first.ts');
			await vi.waitFor(() => expect(build).toHaveBeenCalledTimes(1));
			watcher.emit('change', 'alpha/queued.ts');
			close?.();
			if (outcome === 'success') running.resolve(payload('alpha'));
			else running.reject(new Error('compile failed after close'));
			await wait(150);
			expect(build).toHaveBeenCalledTimes(1);
			expect(send).not.toHaveBeenCalled();
			expect(error).not.toHaveBeenCalled();
		}
	);
});
