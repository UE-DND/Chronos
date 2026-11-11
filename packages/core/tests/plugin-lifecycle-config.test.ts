import { describe, expect, it, vi } from 'vite-plus/test';
import { ChronosEngine } from '../src';
import { createMockEnv } from '../src/test-utils';

describe('plugin configuration ownership', () => {
	it('keeps synchronous plugin cleanup after the configuration queue drains', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const dispose = vi.fn();
		try {
			const handle = await engine.loadPlugin({
				id: 'drained-config-owner',
				name: 'Config owner',
				version: '1',
				apply() {},
				dispose
			});
			await engine.getPluginContext('drained-config-owner').updateConfig({ value: 'committed' });
			handle.dispose();
			expect(dispose).toHaveBeenCalledOnce();
		} finally {
			engine.dispose();
		}
	});

	it('settles started config writes before a failed activation returns its original error and can retry', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const failure = new Error('Activation failed');
		const cleanupError = new Error('Plugin cleanup failed');
		let release!: () => void;
		let started!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});
		const writing = new Promise<void>((resolve) => {
			started = resolve;
		});
		const originalWrite = env.storage.setPluginData.bind(env.storage);
		vi.spyOn(env.storage, 'setPluginData').mockImplementationOnce(async (...args) => {
			started();
			await gate;
			await originalWrite(...args);
		});
		let pending: Promise<void> | undefined;
		const dispose = vi.fn().mockResolvedValue(undefined).mockRejectedValueOnce(cleanupError);
		const apply = vi.fn().mockImplementationOnce(async (ctx) => {
			pending = ctx.updateConfig({ value: 'failed instance committed' });
			await writing;
			throw failure;
		});
		const plugin = {
			id: 'failed-config-owner',
			name: 'Config owner',
			version: '1',
			defaultConfig: { value: 'initial' },
			apply,
			dispose
		};
		const changed = vi.fn();
		engine.on('config:changed', changed);
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		try {
			let settled = false;
			const loading = engine.loadPlugin(plugin);
			const rejected = loading.catch((error: unknown) => {
				settled = true;
				return error;
			});
			await writing;
			await Promise.resolve();
			await Promise.resolve();
			expect(settled).toBe(false);
			expect(dispose).not.toHaveBeenCalled();
			release();
			expect(await rejected).toBe(failure);
			await pending;
			expect(changed).not.toHaveBeenCalled();
			expect(log).toHaveBeenCalledWith(expect.any(String), cleanupError);
			await engine.loadPlugin(plugin);
			const next = engine.getPluginContext(plugin.id);
			expect(next.config).toEqual({ value: 'failed instance committed' });
			await next.updateConfig({ value: 'retry committed' });
			expect(await next.storage.get('__config__')).toEqual({ value: 'retry committed' });
		} finally {
			release();
			engine.dispose();
			log.mockRestore();
		}
	});

	it('waits for old config writes before reloading an ID that is already unloading', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const apply = vi.fn();
		const plugin = {
			id: 'config-owner',
			name: 'Config owner',
			version: '1',
			defaultConfig: { value: 'initial' },
			apply
		};
		await engine.loadPlugin(plugin);
		const old = engine.getPluginContext(plugin.id);
		let release!: () => void;
		let started!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});
		const writing = new Promise<void>((resolve) => {
			started = resolve;
		});
		const originalWrite = env.storage.setPluginData.bind(env.storage);
		vi.spyOn(env.storage, 'setPluginData').mockImplementationOnce(async (...args) => {
			started();
			await gate;
			await originalWrite(...args);
		});
		const changed = vi.fn();
		engine.on('config:changed', changed);
		try {
			const pending = old.updateConfig({ value: 'old committed' });
			await writing;
			const unloading = engine.unloadPlugin(plugin.id);
			const loading = engine.loadPlugin(plugin);
			await Promise.resolve();
			await Promise.resolve();
			expect(apply).toHaveBeenCalledOnce();
			release();
			await Promise.all([pending, unloading, loading]);
			const next = engine.getPluginContext(plugin.id);
			expect(next).not.toBe(old);
			expect(next.config).toEqual({ value: 'old committed' });
			expect(changed).not.toHaveBeenCalled();
			await next.updateConfig({ value: 'new committed' });
			expect(await next.storage.get('__config__')).toEqual({ value: 'new committed' });
		} finally {
			release();
			engine.dispose();
		}
	});
});
