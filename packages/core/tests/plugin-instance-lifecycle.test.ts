import { describe, expect, it, vi } from 'vite-plus/test';
import {
	ChronosEngine,
	IPluginHttpService,
	IStorageService,
	IVaultService,
	type ChronosContext
} from '../src';
import { createMockEnv } from '../src/test-utils';

function deferred() {
	let resolve!: () => void;
	const promise = new Promise<void>((done) => {
		resolve = done;
	});
	return { promise, resolve };
}

describe('plugin instance ownership', () => {
	it('finishes configuration writes accepted before stop, including queued patches', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		await engine.loadPlugin({ id: 'config-writer', name: 'Writer', version: '1', apply() {} });
		const context = engine.getPluginContext('config-writer');
		const gate = deferred();
		const started = deferred();
		const save = env.storage.setPluginData.bind(env.storage);
		vi.spyOn(env.storage, 'setPluginData').mockImplementationOnce(async (id, key, value) => {
			started.resolve();
			await gate.promise;
			await save(id, key, value);
		});
		const first = context.updateConfig({ first: true });
		await started.promise;
		const second = context.updateConfig({ second: true });
		const result = Promise.allSettled([first, second]);
		const stopped = engine.unloadPlugin('config-writer');
		gate.resolve();
		expect((await result).map((entry) => entry.status)).toEqual(['fulfilled', 'fulfilled']);
		await stopped;
		await engine.loadPlugin({ id: 'config-writer', name: 'Writer', version: '1', apply() {} });
		expect(engine.getPluginContext('config-writer').config).toMatchObject({
			first: true,
			second: true
		});
		engine.dispose();
	});
	it('keeps accepted action results and waits for their commits before replacement', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const gate = deferred();
		const started = deferred();
		const save = env.storage.savePreferences.bind(env.storage);
		vi.spyOn(env.storage, 'savePreferences').mockImplementationOnce(async (patch) => {
			started.resolve();
			await gate.promise;
			await save(patch);
		});
		const apply = vi.fn();
		const plugin = { id: 'writer', name: 'Writer', version: '1', apply };
		try {
			await engine.loadPlugin(plugin);
			const old = engine.getPluginContext(plugin.id);
			const writing = old.actions.updatePreferences({ analyticsEnabled: false });
			await started.promise;
			const replacement = engine.loadPlugin(plugin);
			expect(old.signal.aborted).toBe(true);
			expect(apply).toHaveBeenCalledOnce();
			gate.resolve();
			await expect(writing).resolves.toBeUndefined();
			await replacement;
			expect(apply).toHaveBeenCalledTimes(2);
			expect(engine.state.userPreferences.analyticsEnabled).toBe(false);
		} finally {
			gate.resolve();
			engine.dispose();
		}
	});

	it('restores the previous clock lease and fences late updates from a replaced instance', async () => {
		const engine = new ChronosEngine({ env: createMockEnv().env });
		const first = { id: 'first', name: 'First', version: '1', apply() {} };
		try {
			await engine.loadPlugin(first);
			await engine.loadPlugin({ ...first, id: 'second' });
			const old = engine.getPluginContext('first');
			const second = engine.getPluginContext('second');
			old.clock.set(new Date('2026-01-01T00:00:00Z'));
			second.clock.set(new Date('2026-02-01T00:00:00Z'));
			old.clock.set(new Date('2026-03-01T00:00:00Z'));
			await engine.loadPlugin(first);
			expect(engine.now().toISOString()).toBe('2026-02-01T00:00:00.000Z');
			engine.getPluginContext('first').clock.set(new Date('2026-04-01T00:00:00Z'));
			expect(() => old.clock.set(null)).toThrow('disposed');
			expect(() => old.clock.set(new Date())).toThrow('disposed');
			expect(engine.now().toISOString()).toBe('2026-04-01T00:00:00.000Z');
			await engine.unloadPlugin('first');
			expect(engine.now().toISOString()).toBe('2026-02-01T00:00:00.000Z');
			await engine.unloadPlugin('second');
			expect(engine.state.clockFrozen).toBe(false);
		} finally {
			engine.dispose();
		}
	});

	it('binds HTTP ownership and signals and exposes only frozen domain queries', async () => {
		const request = vi.fn().mockResolvedValue({ ok: true });
		const proxy = vi.fn().mockResolvedValue({ ok: true });
		const { env } = createMockEnv({ http: { request, proxy, supportsPluginServer: () => true } });
		const engine = new ChronosEngine({ env });
		try {
			await engine.init();
			const timetable = await engine.createTimetable('Frozen');
			await engine.loadPlugin({
				id: 'http-owner',
				name: 'HTTP',
				version: '1',
				allowedDomains: ['example.com'],
				apply() {}
			});
			const ctx = engine.getPluginContext('http-owner');
			expect(ctx.tryService(IStorageService)).toBeUndefined();
			expect(ctx.tryService(IVaultService)).toBeUndefined();
			expect('setVirtualNow' in ctx.actions).toBe(false);
			const view = await ctx.query.getTimetable(timetable.id);
			expect(Object.isFrozen(view?.academicConfig)).toBe(true);
			const http = ctx.service(IPluginHttpService);
			await expect(http.request('https://example.com.attacker.test')).rejects.toThrow(
				'not allowed'
			);
			const caller = new AbortController();
			await http.request('https://sub.example.com/path', { signal: caller.signal });
			caller.abort();
			expect(request.mock.calls[0]![1].signal.aborted).toBe(true);
			await http.proxy('preview', { value: 1 });
			expect(proxy).toHaveBeenCalledWith('http-owner', 'preview', { value: 1 }, expect.anything());
			await engine.unloadPlugin('http-owner');
			expect(proxy.mock.calls[0]![3].signal.aborted).toBe(true);
			await expect(http.proxy('late', {})).rejects.toThrow('disposed');
		} finally {
			engine.dispose();
		}
	});
	it('rejects candidate writes and opens them only after acceptance', async () => {
		const { env } = createMockEnv();
		const engine = new ChronosEngine({ env });
		const loaded = vi.fn();
		engine.on('plugin:loaded', loaded);
		let context!: ChronosContext;
		try {
			const handle = await engine.loadPlugin(
				{
					id: 'candidate',
					name: 'Candidate',
					version: '1',
					async apply(ctx) {
						context = ctx;
						await expect(ctx.storage.set('cache', 1)).rejects.toThrow('accepted');
					}
				},
				{ deferAcceptance: true }
			);
			expect(loaded).not.toHaveBeenCalled();
			handle.accept();
			await context.storage.set('cache', 2);
			expect(await context.storage.get('cache')).toBe(2);
			expect(loaded).toHaveBeenCalledOnce();
		} finally {
			engine.dispose();
		}
	});

	it('makes old handles and late registration harmless after replacement', async () => {
		const engine = new ChronosEngine({ env: createMockEnv().env });
		const plugin = { id: 'owner', name: 'Owner', version: '1', apply() {} };
		try {
			const oldHandle = await engine.loadPlugin(plugin);
			const old = engine.getPluginContext(plugin.id);
			await engine.loadPlugin(plugin);
			oldHandle.dispose();
			expect(engine.isPluginLoaded(plugin.id)).toBe(true);
			expect(old.signal.aborted).toBe(true);
			const dispose = vi.fn();
			old.addDisposable({ dispose });
			expect(dispose).toHaveBeenCalledOnce();
			expect(() =>
				old.registerSlot('mine.item', { id: 'late', title: 'Late', sectionId: 'tools' })
			).toThrow('disposed');
			await expect(old.actions.updatePreferences({ analyticsEnabled: false })).rejects.toThrow(
				'disposed'
			);
		} finally {
			engine.dispose();
		}
		expect(() => engine.getPluginContext(plugin.id)).toThrow('not running');
	});

	it('cancels a slow activation before it can publish a running instance', async () => {
		const engine = new ChronosEngine({ env: createMockEnv().env });
		let release!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});
		let entered!: () => void;
		const started = new Promise<void>((resolve) => {
			entered = resolve;
		});
		let context!: ChronosContext;
		const loading = engine.loadPlugin({
			id: 'slow',
			name: 'Slow',
			version: '1',
			async apply(ctx) {
				context = ctx;
				entered();
				await gate;
			}
		});
		const rejected = expect(loading).rejects.toThrow();
		await started;
		const stopping = engine.unloadPlugin('slow');
		expect(context.signal.aborted).toBe(true);
		release();
		await Promise.all([stopping, rejected]);
		expect(engine.isPluginLoaded('slow')).toBe(false);
		engine.dispose();
	});
});
