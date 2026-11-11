import { describe, it, expect, vi } from 'vite-plus/test';
import { ScopedContext } from '../src/runtime/scoped-context';
import { EventPipeline } from '../src/runtime/event-pipeline';
import { HierarchicalSlotRegistry } from '../src/runtime/hierarchical-slot-registry';
import { ThemeRegistry } from '../src/runtime/theme-registry';
import { BadgeManager } from '../src/runtime/badge-manager';
import { I18nCatalog } from '../src/i18n/i18n-catalog';
import { IErrorCaptureService, IHttpService, createServiceIdentifier } from '../src/types/services';
import { createMockErrorCapture } from '../src/test-utils/create-mock-error-capture';
import type { ChronosEnv } from '../src/types/env';
import { DEFAULT_USER_PREFERENCES } from '../src/domain/preferences';

function createMockHost() {
	const kvStore = new Map<string, unknown>();

	const storageService: import('../src/types/services').IStorageService = {
		getTimetable: vi.fn(),
		listTimetables: vi.fn(),
		saveTimetable: vi.fn(),
		deleteTimetable: vi.fn(),
		getActiveTimetableId: vi.fn(),
		setActiveTimetableId: vi.fn(),
		queryCourses: vi.fn(async () => []),
		getPreferences: async () => DEFAULT_USER_PREFERENCES,
		savePreferences: vi.fn(),
		getPluginData: async <T>(pluginId: string, key: string): Promise<T | null> =>
			(kvStore.get(`${pluginId}:${key}`) as T) ?? null,
		setPluginData: async <T>(pluginId: string, key: string, value: T): Promise<void> => {
			kvStore.set(`${pluginId}:${key}`, value);
		},
		deletePluginData: async (pluginId: string, key: string): Promise<void> => {
			kvStore.delete(`${pluginId}:${key}`);
		}
	};

	const httpService: import('../src/types/services').IHttpService = {
		request: vi.fn()
	};

	const eventPipeline = new EventPipeline();
	const slots = new HierarchicalSlotRegistry();
	const themes = new ThemeRegistry(slots);
	const badges = new BadgeManager();
	const i18nCatalog = new I18nCatalog();

	const env: ChronosEnv = {
		platform: 'node',
		http: httpService,
		storage: storageService,
		vault: {
			isSupported: async () => false,
			storeSecret: vi.fn(),
			getSecret: vi.fn(),
			removeSecret: vi.fn()
		},
		runtime: {
			sha256: async () => ''
		},
		errorCapture: createMockErrorCapture()
	};

	return {
		env,
		events: eventPipeline,
		slots,
		themes,
		badges,
		i18nCatalog,
		locale: 'zh-cn',
		t: (key: string) => key,
		translateForPlugin: (pluginId: string, key: string) =>
			i18nCatalog.t(pluginId, key, 'zh-cn') ?? key,
		state: {
			currentTimetable: null,
			activeWeek: 1,
			currentPeriodIndex: null,
			activeThemeId: 'default',
			activeIconThemeId: 'host-default',
			userPreferences: DEFAULT_USER_PREFERENCES,
			now: new Date(),
			todayIso: '2026-03-02',
			clockFrozen: false,
			locale: 'zh-cn'
		},
		actions: {
			createTimetable: vi.fn(),
			importTimetable: vi.fn(),
			switchTimetable: vi.fn(),
			deleteTimetable: vi.fn(),
			updateTimetableDetails: vi.fn(),
			saveCourse: vi.fn(),
			updateCourse: vi.fn(),
			deleteCourse: vi.fn(),
			deleteCourseForWeek: vi.fn(),
			rearrangeCourse: vi.fn(),
			setTheme: vi.fn(),
			updatePreferences: vi.fn(),
			revertToDefaultThemes: vi.fn(),
			notify: vi.fn(),
			setVirtualNow: vi.fn()
		}
	};
}

describe('ScopedContext in @chronos/core', () => {
	it('isolates storage namespace by pluginId', async () => {
		const host = createMockHost();
		const ctxA = new ScopedContext('plugin-a', host);
		const ctxB = new ScopedContext('plugin-b', host);

		await ctxA.storage.set('config', { enabled: true });
		await ctxB.storage.set('config', { enabled: false });

		expect(await ctxA.storage.get('config')).toEqual({ enabled: true });
		expect(await ctxB.storage.get('config')).toEqual({ enabled: false });

		await ctxA.storage.delete('config');
		expect(await ctxA.storage.get('config')).toBeNull();
		expect(await ctxB.storage.get('config')).toEqual({ enabled: false });
	});

	it('resolves capability services from ChronosEnv', () => {
		const host = createMockHost();
		const ctx = new ScopedContext('plugin-a', host);

		const http = ctx.service(IHttpService);
		expect(http).toBeDefined();
		expect(typeof http.request).toBe('function');

		const errorCapture = ctx.service(IErrorCaptureService);
		expect(errorCapture).toBeDefined();
		expect(typeof errorCapture.onCaptured).toBe('function');

		const missingId = createServiceIdentifier<unknown>('nonExistent');
		expect(() => ctx.service(missingId)).toThrowError();
	});

	it('updates config, persists to storage and fires event', async () => {
		const host = createMockHost();
		const ctx = new ScopedContext<{ campus: string }>('plugin-a', host, {
			campus: 'huaxi'
		});

		const onConfigChanged = vi.fn();
		host.events.on('config:changed', onConfigChanged);

		expect(ctx.config.campus).toBe('huaxi');
		await ctx.updateConfig({ campus: 'liangjiang' });

		expect(ctx.config.campus).toBe('liangjiang');
		expect(onConfigChanged).toHaveBeenCalledWith({
			pluginId: 'plugin-a',
			config: { campus: 'liangjiang' }
		});
		expect(await ctx.storage.get('__config__')).toEqual({ campus: 'liangjiang' });
	});

	it('keeps the committed config and emits no change when persistence fails', async () => {
		const host = createMockHost();
		const ctx = new ScopedContext('plugin-a', host, { campus: 'huaxi' });
		const changed = vi.fn();
		host.events.on('config:changed', changed);
		const failure = new Error('Config write failed');
		vi.spyOn(host.env.storage, 'setPluginData').mockRejectedValueOnce(failure);
		await expect(ctx.updateConfig({ campus: 'liangjiang' })).rejects.toBe(failure);
		expect(ctx.config).toEqual({ campus: 'huaxi' });
		expect(changed).not.toHaveBeenCalled();
		await ctx.updateConfig({ campus: 'liangjiang' });
		expect(ctx.config).toEqual({ campus: 'liangjiang' });
	});

	it('serializes config patches and publishes only committed values', async () => {
		const host = createMockHost();
		const ctx = new ScopedContext('plugin-a', host, { campus: 'huaxi', enabled: false });
		let release!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});
		const write = host.env.storage.setPluginData.bind(host.env.storage);
		vi.spyOn(host.env.storage, 'setPluginData').mockImplementationOnce(async (...args) => {
			await gate;
			await write(...args);
		});
		const first = ctx.updateConfig({ campus: 'liangjiang' });
		const second = ctx.updateConfig({ enabled: true });
		expect(ctx.config).toEqual({ campus: 'huaxi', enabled: false });
		release();
		await Promise.all([first, second]);
		expect(ctx.config).toEqual({ campus: 'liangjiang', enabled: true });
		expect(await ctx.storage.get('__config__')).toEqual(ctx.config);
	});

	it('stops queued config writes on disposal and never publishes an old in-flight write', async () => {
		const host = createMockHost();
		const ctx = new ScopedContext('plugin-a', host, { campus: 'huaxi' });
		let release!: () => void;
		let started!: () => void;
		const gate = new Promise<void>((resolve) => {
			release = resolve;
		});
		const writing = new Promise<void>((resolve) => {
			started = resolve;
		});
		const write = host.env.storage.setPluginData.bind(host.env.storage);
		const persistence = vi
			.spyOn(host.env.storage, 'setPluginData')
			.mockImplementationOnce(async (...args) => {
				started();
				await gate;
				await write(...args);
			});
		const changed = vi.fn();
		host.events.on('config:changed', changed);
		const first = ctx.updateConfig({ campus: 'liangjiang' });
		const second = ctx.updateConfig({ campus: 'queued' });
		const stopped = expect(second).rejects.toThrow('disposed');
		await writing;
		ctx.dispose();
		const late = expect(ctx.updateConfig({ campus: 'late' })).rejects.toThrow('disposed');
		release();
		await first;
		await stopped;
		await late;
		expect(persistence).toHaveBeenCalledOnce();
		expect(changed).not.toHaveBeenCalled();
		expect(ctx.config).toEqual({ campus: 'huaxi' });
		expect(await ctx.storage.get('__config__')).toEqual({ campus: 'liangjiang' });
	});

	it('tracks subscriptions and disposes all in LIFO order upon ctx.dispose()', () => {
		const host = createMockHost();
		const ctx = new ScopedContext('plugin-a', host);
		const callOrder: string[] = [];

		ctx.addDisposable({
			dispose: () => {
				callOrder.push('first-registered');
			}
		});

		ctx.registerSlot('mine.item', {
			id: 'item-1',
			sectionId: 'sec',
			title: 'Item 1'
		});

		ctx.addDisposable({
			dispose: () => {
				callOrder.push('last-registered');
			}
		});

		expect(ctx.subscriptions.length).toBe(3);
		expect(host.slots.get('mine.item').length).toBe(1);

		ctx.dispose();

		expect(ctx.subscriptions.length).toBe(0);
		expect(host.slots.get('mine.item').length).toBe(0);
		expect(callOrder).toEqual(['last-registered', 'first-registered']);
	});

	it('routes timetable.cell.badge slot registration to BadgeManager and unregisters upon disposal', () => {
		const host = createMockHost();
		const ctx = new ScopedContext('plugin-a', host);

		const handle = ctx.registerSlot('timetable.cell.badge', {
			id: 'badge-test',
			getBadge: () => ({ id: 'b1', text: 'Badge 1' })
		});

		expect(host.slots.get('timetable.cell.badge').length).toBe(1);

		handle.dispose();

		expect(host.slots.get('timetable.cell.badge').length).toBe(0);
	});
});
