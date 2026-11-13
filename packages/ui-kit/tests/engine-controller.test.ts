import { describe, it, expect, vi, beforeEach } from 'vite-plus/test';
import {
	ChronosEngine,
	createCourse,
	createTimetable,
	type ChronosContext,
	type ChronosEnv,
	type CourseBadge,
	type Timetable,
	type UserPreferences
} from '@chronos/core';
import { get } from 'svelte/store';
import { ReactiveChronosController } from '../src/reactivity/engine-controller.svelte';
import { createChronosUiView } from '../src/reactivity/chronos-ui-view';
import { createPluginUiProps } from '../src/plugin-screen/plugin-ui-props';
import { createEdgeBarActions } from '../src/plugin-screen/edge-bar-actions.svelte';

function createMockEnv(): ChronosEnv {
	const timetables = new Map<string, Timetable>();
	let activeId: string | null = null;
	let prefs: UserPreferences = {
		schemaVersion: 1,
		themeMode: 'auto',
		fontSizeScale: 1,
		wallpaperSource: 'theme',
		wallpaperColorEnabled: false,
		wallpaperMaskEnabled: true,
		timetableLayoutMode: 'fixed',
		capsuleCornerStyle: 'rounded',
		hapticFeedbackEnabled: true,
		prepareReminderMinutes: 30,
		classNotificationsEnabled: false,
		analyticsEnabled: true,
		reduceMotionEnabled: false,
		currentPeriodHighlightEnabled: true
	};
	const pluginData = new Map<string, unknown>();

	return {
		platform: 'web',
		http: {
			request: vi.fn()
		},
		storage: {
			getTimetable: vi.fn(async (id: string) => timetables.get(id) ?? null),
			listTimetables: vi.fn(async () =>
				Array.from(timetables.values()).map((t) => ({
					id: t.id,
					name: t.name,
					updatedAt: t.updatedAt
				}))
			),
			saveTimetable: vi.fn(async (t: Timetable) => {
				timetables.set(t.id, t);
			}),
			deleteTimetable: vi.fn(async (id: string) => {
				timetables.delete(id);
			}),
			getActiveTimetableId: vi.fn(async () => activeId),
			setActiveTimetableId: vi.fn(async (id: string) => {
				activeId = id;
			}),
			queryCourses: vi.fn(async () => []),
			getPreferences: vi.fn(async () => ({ ...prefs })),
			savePreferences: vi.fn(async (p: Partial<UserPreferences>) => {
				prefs = { ...prefs, ...p };
			}),
			getPluginData: vi.fn(async (pId: string, k: string) => {
				const val = pluginData.get(`${pId}:${k}`);
				return val !== undefined ? (val as never) : null;
			}),
			setPluginData: vi.fn(async <T>(pId: string, k: string, v: T) => {
				pluginData.set(`${pId}:${k}`, v);
			}),
			deletePluginData: vi.fn(async (pId: string, k: string) => {
				pluginData.delete(`${pId}:${k}`);
			})
		},
		vault: {
			isSupported: vi.fn(async () => true),
			storeSecret: vi.fn(async () => {}),
			getSecret: vi.fn(async () => null),
			removeSecret: vi.fn(async () => {})
		},
		runtime: {
			sha256: vi.fn(async () => 'mock-hash')
		}
	};
}

describe('ReactiveChronosController', () => {
	let engine: ChronosEngine;
	let env: ChronosEnv;

	beforeEach(async () => {
		env = createMockEnv();
		engine = new ChronosEngine({ env });
		await engine.init();
	});

	it('synchronizes initial engine state and slots', () => {
		const controller = new ReactiveChronosController(engine);

		expect(controller.currentTimetable).toBeNull();
		expect(controller.activeWeek).toBe(1);
		expect(controller.activeThemeId).toBeNull();
		expect(controller.userPreferences).toBeDefined();
		expect(controller.locale).toBe('zh-cn');
		expect(controller.slotVersion).toBeGreaterThanOrEqual(1);
		expect(controller.getSlots('import.source.tab')).toEqual([]);
		expect(controller.getSlots('export.action')).toEqual([]);
		expect(controller.getSlots('course.detail.action')).toEqual([]);
		expect(controller.courseBadges).toEqual({});

		controller.dispose();
	});

	it('keeps committed data visible and reports a failed write follow-up', async () => {
		const controller = new ReactiveChronosController(engine);
		const notify = vi.spyOn(controller, 'notify');
		const log = vi.spyOn(console, 'error').mockImplementation(() => {});
		const failure = new Error('List read failed');
		vi.mocked(env.storage.listTimetables).mockRejectedValueOnce(failure);
		try {
			const saved = await controller.createTimetable('Committed');
			expect(controller.timetables).toContainEqual(
				expect.objectContaining({ id: saved.id, name: 'Committed' })
			);
			expect(notify).toHaveBeenCalledWith(expect.any(String), 'warn');
			expect(log).toHaveBeenCalledWith(
				'[timetable] Write committed but follow-up failed:',
				{ operation: 'create', timetableId: saved.id },
				failure
			);
		} finally {
			controller.dispose();
			log.mockRestore();
		}
	});

	it('keeps shared state names and explicit timetable updates consistent with the engine', async () => {
		const controller = new ReactiveChronosController(engine);
		try {
			const a = await engine.createTimetable('A');
			const b = await engine.createTimetable('B');
			await controller.updateTimetableDetails(b.id, { name: 'Updated B' });
			expect(controller.currentTimetable?.id).toBe(a.id);
			expect(get(controller.snapshot).timetables.find((t) => t.id === b.id)?.name).toBe(
				'Updated B'
			);
			engine.setVirtualNow(new Date('2026-10-01T09:00:00'));
			engine.setLocale('en');
			expect(get(controller.snapshot)).toMatchObject(engine.state);
			await controller.updateTimetableDetails(a.id, { name: 'Updated A' });
			expect(controller.currentTimetable?.name).toBe('Updated A');
		} finally {
			controller.dispose();
			engine.dispose();
		}
	});
	it('uses the accepted engine snapshots after lifecycle events', async () => {
		const controller = new ReactiveChronosController(engine);
		try {
			const imported = await engine.importTimetable(
				createTimetable({
					id: 'imported',
					name: 'Imported',
					courses: [
						createCourse({
							id: 'course',
							name: 'Original',
							dayOfWeek: 1,
							startPeriod: 1,
							endPeriod: 2,
							weeks: [1, 2]
						})
					]
				})
			);
			expect(controller.currentTimetable).toBe(engine.state.currentTimetable);
			expect(controller.timetables).toBe(engine.state.timetables);
			expect(Object.isFrozen(controller.currentTimetable?.courses[0]?.weeks)).toBe(true);
			imported.courses[0]!.name = 'Caller edit';
			expect(controller.currentTimetable?.courses[0]?.name).toBe('Original');
			await controller.updatePreferences({ themeMode: 'dark' });
			expect(controller.userPreferences).toBe(engine.state.userPreferences);
			await controller.updateTimetableDetails(imported.id, { name: 'Updated' });
			expect(controller.currentTimetable).toBe(engine.state.currentTimetable);
		} finally {
			controller.dispose();
			engine.dispose();
		}
	});
	it('updates controller userPreferences when engine.init() completes after controller instantiation', async () => {
		const uninitEngine = new ChronosEngine({ env });
		await env.storage.savePreferences({ timetableLayoutMode: 'compact' });

		const controller = new ReactiveChronosController(uninitEngine);
		expect(controller.userPreferences?.timetableLayoutMode).toBe('compact');

		await uninitEngine.init();
		expect(controller.userPreferences?.timetableLayoutMode).toBe('compact');

		controller.dispose();
		uninitEngine.dispose();
	});

	it('reactively tracks timetable changes and action dispatch', async () => {
		const controller = new ReactiveChronosController(engine);

		const timetable = await controller.createTimetable('测试课表');
		expect(controller.currentTimetable?.id).toBe(timetable.id);
		expect(controller.currentTimetable?.name).toBe('测试课表');

		const course = createCourse({
			id: 'c1',
			name: '大学物理',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 2,
			weeks: [1, 2, 3]
		});
		await controller.saveCourse(course);
		expect(controller.currentTimetable?.courses.length).toBe(1);

		await controller.updateCourse('c1', { name: '大学物理实验' });
		expect(controller.currentTimetable?.courses[0]?.name).toBe('大学物理实验');

		await controller.deleteCourse('c1');
		expect(controller.currentTimetable?.courses.length).toBe(0);

		controller.dispose();
	});

	it('keeps public timetable views immutable and snapshot subscriptions read-only', async () => {
		const controller = new ReactiveChronosController(engine);
		try {
			const timetable = await controller.createTimetable('Immutable');
			await controller.saveCourse(
				createCourse({ id: 'first', name: 'First', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 }),
				timetable.id
			);
			const snapshot = get(controller.snapshot);
			expect(Reflect.set(controller, 'currentTimetable', null)).toBe(false);
			expect(Reflect.set(snapshot, 'currentTimetable', null)).toBe(false);
			expect(Reflect.set(controller.currentTimetable!.courses[0]!, 'name', 'Changed')).toBe(false);
			expect(Reflect.has(controller.snapshot, 'set')).toBe(false);
			expect(engine.state.currentTimetable?.courses[0]?.name).toBe('First');
			expect(get(controller.snapshot).currentTimetable?.courses[0]?.name).toBe('First');
		} finally {
			controller.dispose();
			engine.dispose();
		}
	});

	it('publishes immutable badge views through its getter and readable snapshots', async () => {
		const controller = new ReactiveChronosController(engine);
		const providerBadge: CourseBadge = { id: 'badge', text: 'Original' };
		engine.badges.registerCourseBadge({ id: 'provider', getBadge: () => [providerBadge] });
		try {
			const timetable = await controller.createTimetable('Badges');
			await controller.saveCourse(
				createCourse({ id: 'course', name: 'Course', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 }),
				timetable.id
			);
			const snapshot = get(controller.snapshot);
			providerBadge.text = 'Provider edit';
			expect(Reflect.set(controller, 'courseBadges', {})).toBe(false);
			expect(Reflect.set(snapshot.courseBadges.course![0]!, 'text', 'Consumer edit')).toBe(false);
			expect(Reflect.set(controller.courseBadges, 'course', [])).toBe(false);
			expect(controller.courseBadges).toBe(engine.badges.getAll());
			expect(snapshot.courseBadges.course?.[0]?.text).toBe('Original');
			expect(engine.badges.getAll().course?.[0]?.text).toBe('Original');
		} finally {
			controller.dispose();
			engine.dispose();
		}
	});

	it('uses the engine badge cache after badge events', () => {
		const controller = new ReactiveChronosController(engine);
		try {
			const injected = { course: [{ id: 'injected', text: 'Injected' }] };
			engine.events.emit('badges:updated', { badges: injected });
			injected.course[0]!.text = 'Later edit';
			expect(controller.courseBadges).toBe(engine.badges.getAll());
			expect(get(controller.snapshot).courseBadges).toEqual({});
		} finally {
			controller.dispose();
			engine.dispose();
		}
	});

	it('updates UI badges immediately as badge plugins load and unload', async () => {
		const controller = new ReactiveChronosController(engine);
		try {
			await controller.createTimetable('Badges');
			await controller.saveCourse(
				createCourse({ id: 'course', name: 'Course', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
			);
			const plugin = await engine.loadPlugin({
				id: 'badge-plugin',
				name: 'Badge plugin',
				version: '1.0.0',
				apply(ctx) {
					ctx.registerSlot('timetable.cell.badge', {
						id: 'badge-provider',
						getBadge: () => ({ id: 'badge', text: 'Original' })
					});
				}
			});
			expect(controller.courseBadges.course?.[0]?.text).toBe('Original');
			const remainingPlugin = await engine.loadPlugin({
				id: 'remaining-badge-plugin',
				name: 'Remaining badge plugin',
				version: '1.0.0',
				apply(ctx) {
					ctx.registerSlot('timetable.cell.badge', {
						id: 'remaining-badge-provider',
						getBadge: () => ({ id: 'remaining-badge', text: 'Remaining' })
					});
				}
			});
			expect(controller.courseBadges.course).toHaveLength(2);

			plugin.dispose();
			expect(controller.courseBadges.course).toEqual([
				{ id: 'remaining-badge', text: 'Remaining' }
			]);
			remainingPlugin.dispose();
			expect(controller.courseBadges).toEqual({});
			expect(get(controller.snapshot).courseBadges).toBe(engine.badges.getAll());
		} finally {
			controller.dispose();
			engine.dispose();
		}
	});

	it('reactively updates preferences, themes, and time ticks', async () => {
		const controller = new ReactiveChronosController(engine);

		await controller.updatePreferences({ themeMode: 'dark', timetableLayoutMode: 'compact' });
		expect(controller.userPreferences?.themeMode).toBe('dark');
		expect(controller.userPreferences?.timetableLayoutMode).toBe('compact');

		controller.setTheme('custom-theme');
		expect(controller.activeThemeId).toBe('custom-theme');

		controller.dispose();
	});

	it('synchronizes dynamic slots and tracks slotVersion', async () => {
		const controller = new ReactiveChronosController(engine);
		const initialVersion = controller.slotVersion;

		const testPlugin = {
			id: 'test-plugin',
			name: 'Test Plugin',
			version: '1.0.0',
			apply(ctx: ChronosContext) {
				ctx.registerSlot('shell.bottom-bar.tab', {
					id: 'today',
					label: () => 'Today',
					order: 15
				});
				ctx.registerSlot('import.source.tab', {
					id: 'test-tab',
					title: () => 'Tab 1',
					order: 10,
					executeImport: async () => createTimetable({ id: 'imported', name: 'Imported' })
				});
				ctx.registerSlot('mine.section', {
					id: 'sec-1',
					title: 'Section 1',
					order: 5
				});
				ctx.registerSlot('shell.route.screen', {
					id: 'screen-1',
					title: 'Screen 1'
				});
			}
		};

		const pluginHandle = await engine.loadPlugin(testPlugin);
		expect(controller.slotVersion).toBeGreaterThan(initialVersion);

		expect(controller.resolveSlotOwner('shell.bottom-bar.tab', 'today')).toBe('test-plugin');
		expect(controller.resolveSlotOwner('shell.bottom-bar.tab', 'missing')).toBeUndefined();

		const tabs = controller.getSlots('import.source.tab');
		expect(tabs.length).toBe(1);
		expect(tabs[0]?.id).toBe('test-tab');

		const sections = controller.getSlots('mine.section');
		expect(sections.length).toBe(1);
		expect(sections[0]?.id).toBe('sec-1');

		const screen = controller.getSlotItem('shell.route.screen', 'screen-1');
		expect(screen).toBeDefined();
		expect(screen?.id).toBe('screen-1');

		const preUnloadVersion = controller.slotVersion;
		pluginHandle.dispose();
		expect(controller.slotVersion).toBeGreaterThan(preUnloadVersion);
		expect(controller.getSlots('import.source.tab').length).toBe(0);

		controller.dispose();
	});

	it('exposes a readable snapshot store for cross-runtime consumers', () => {
		const controller = new ReactiveChronosController(engine);
		const locales: string[] = [];
		const unsubscribe = controller.snapshot.subscribe((snapshot) => {
			locales.push(snapshot.locale);
		});

		expect(get(controller.snapshot).locale).toBe('zh-cn');
		engine.setLocale('en');
		expect(locales.at(-1)).toBe('en');

		unsubscribe();
		controller.dispose();
	});

	it('mounts plugins with an actual read-only view and only their own context and edge actions', async () => {
		const controller = new ReactiveChronosController(engine);
		const contexts: ChronosContext[] = [];
		await engine.loadPlugin({
			id: 'ui-test',
			name: 'UI test',
			version: '1',
			apply(ctx) {
				contexts.push(ctx);
			}
		});
		const context = contexts[0]!;
		const edges = createEdgeBarActions();
		const props = createPluginUiProps(controller, context.pluginId, { edgeActions: edges })!;
		expect(props.context).toBe(context);
		expect(props.controller).not.toBe(controller);
		expect(Object.isFrozen(props.controller)).toBe(true);
		for (const privateKey of [
			'engine',
			'dispose',
			'clearAllData',
			'getPluginContext',
			'getSlots',
			'saveCourse',
			'deleteTimetable'
		]) {
			expect(privateKey in props.controller).toBe(false);
		}
		const snapshots: string[] = [];
		const unsubscribe = props.controller.snapshot.subscribe((value) =>
			snapshots.push(value.locale)
		);
		engine.setLocale('en');
		expect(snapshots.at(-1)).toBe('en');
		expect(props.controller.locale).toBe('en');
		const action = { id: 'own', label: 'Own', icon: 'check', onClick: vi.fn() };
		props.edgeActions!.register([action]);
		expect(edges.get('ui-test')).toEqual([action]);
		expect(Object.keys(props.edgeActions!)).toEqual(['register']);
		await engine.unloadPlugin('ui-test');
		const before = snapshots.length;
		engine.setLocale('zh-cn');
		expect(snapshots).toHaveLength(before);
		expect(edges.get('ui-test')).toEqual([]);
		props.edgeActions!.register([action]);
		expect(edges.get('ui-test')).toEqual([]);
		unsubscribe();
		controller.dispose();
	});

	it('does not expose a page context until its candidate is accepted', async () => {
		const controller = new ReactiveChronosController(engine);
		const handle = await engine.loadPlugin(
			{
				id: 'candidate-ui',
				name: 'Candidate',
				version: '1',
				apply() {}
			},
			{ deferAcceptance: true }
		);
		expect(createPluginUiProps(controller, 'candidate-ui')).toBeUndefined();
		handle.accept();
		expect(createPluginUiProps(controller, 'candidate-ui')?.context.pluginId).toBe('candidate-ui');
		controller.dispose();
	});

	it('does not leak additional history-controller methods through the public view', () => {
		const history = { openOverlay: vi.fn(), clearPrivateHistory: vi.fn() };
		const controller = new ReactiveChronosController(engine, { overlayHistoryPort: history });
		const view = createChronosUiView(controller);
		expect(Object.keys(view.overlayHistoryPort!)).toEqual(['openOverlay']);
		expect(Object.isFrozen(view.overlayHistoryPort)).toBe(true);
		controller.dispose();
	});

	it('bumps slotVersion on locale change', () => {
		const controller = new ReactiveChronosController(engine);
		const prevVersion = controller.slotVersion;

		engine.setLocale('en');
		expect(controller.locale).toBe('en');
		expect(controller.slotVersion).toBeGreaterThan(prevVersion);

		controller.dispose();
	});
});
