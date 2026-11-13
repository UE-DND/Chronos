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
			await engine.unloadPlugin('drained-config-owner');
			expect(dispose).toHaveBeenCalledOnce();
		} finally {
			engine.dispose();
		}
	});

	it('rejects persistence from a failed candidate and retries from the last committed config', async () => {
		const { env } = createMockEnv();
		await env.storage.setPluginData('failed-config-owner', '__config__', { value: 'committed' });
		const engine = new ChronosEngine({ env });
		const failure = new Error('Activation failed');
		const apply = vi.fn().mockImplementationOnce(async (ctx) => {
			await expect(ctx.updateConfig({ value: 'candidate' })).rejects.toThrow('accepted');
			throw failure;
		});
		const dispose = vi.fn();
		const plugin = {
			id: 'failed-config-owner',
			name: 'Config owner',
			version: '1',
			defaultConfig: { value: 'initial' },
			apply,
			dispose
		};
		try {
			await expect(engine.loadPlugin(plugin)).rejects.toBe(failure);
			expect(dispose).toHaveBeenCalledOnce();
			await engine.loadPlugin(plugin);
			const next = engine.getPluginContext(plugin.id);
			expect(next.config).toEqual({ value: 'committed' });
			await next.updateConfig({ value: 'retry' });
			expect(await next.storage.get('__config__')).toEqual({ value: 'retry' });
		} finally {
			engine.dispose();
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
