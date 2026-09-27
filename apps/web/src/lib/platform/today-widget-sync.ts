import {
	buildTodayWidgetSnapshot,
	normalizedCourseName,
	todayIsoDate,
	type ChronosEngine,
	type Disposable
} from '@chronos/core';
import type { HostPlatformAdapter } from './host-platform';

type VisibilityTarget = Pick<
	Document,
	'addEventListener' | 'removeEventListener' | 'visibilityState'
>;

export interface TodayWidgetSyncOptions {
	todayIso?: () => string;
	now?: () => number;
	visibilityTarget?: VisibilityTarget;
}

export interface TodayWidgetSyncService {
	start(): void;
	sync(): Promise<void>;
	dispose(): void;
}

export function createTodayWidgetSyncService(
	engine: Pick<ChronosEngine, 'events' | 'state' | 'coursePresentation'>,
	platform: Pick<HostPlatformAdapter, 'updateTodayWidgetSnapshot'>,
	options: TodayWidgetSyncOptions = {}
): TodayWidgetSyncService {
	const getTodayIso = options.todayIso ?? (() => todayIsoDate());
	const getNow = options.now ?? Date.now;
	const subscriptions: Disposable[] = [];
	let disposed = false;
	let started = false;
	let lastDateIso = getTodayIso();
	let requested = 0;
	let completed = 0;
	let pending: Promise<void> | undefined;

	async function publishSnapshot(): Promise<void> {
		if (disposed || !platform.updateTodayWidgetSnapshot) return;
		const timetable = engine.state.currentTimetable;
		let colorsByCourseName: Map<string, string> | undefined;
		if (timetable && engine.coursePresentation) {
			try {
				const paints = await engine.coursePresentation.resolveCoursePaintsForTimetable(
					timetable.id
				);
				colorsByCourseName = new Map(
					[...paints].map(([name, paint]) => [normalizedCourseName(name), paint.background])
				);
			} catch (error) {
				console.warn('[today-widget] Failed to resolve course colors', error);
			}
		}
		if (disposed) return;
		const snapshot = buildTodayWidgetSnapshot({
			timetable,
			startDateIso: getTodayIso(),
			generatedAt: getNow(),
			locale: typeof navigator === 'undefined' ? 'zh-CN' : navigator.language,
			colorsByCourseName
		});
		await platform.updateTodayWidgetSnapshot(snapshot);
	}

	async function drain(): Promise<void> {
		while (!disposed && completed < requested) {
			const generation = requested;
			try {
				await publishSnapshot();
			} catch (error) {
				console.error('[today-widget] Failed to sync widget snapshot', error);
			}
			completed = generation;
		}
	}

	function sync(): Promise<void> {
		if (disposed || !platform.updateTodayWidgetSnapshot) return Promise.resolve();
		requested += 1;
		if (!pending) {
			pending = drain().finally(() => {
				pending = undefined;
				if (!disposed && completed < requested) void sync();
			});
		}
		return pending;
	}

	function subscribeEvents(): void {
		const update = () => void sync();
		for (const event of [
			'timetable:loaded',
			'timetable:updated',
			'timetable:switched',
			'timetables:updated',
			'preferences:updated',
			'coursePalette:changed'
		] as const) {
			subscriptions.push(engine.events.on(event, update));
		}
		subscriptions.push(
			engine.events.on('time:tick', () => {
				const dateIso = getTodayIso();
				if (dateIso === lastDateIso) return;
				lastDateIso = dateIso;
				update();
			})
		);
	}

	const onVisibilityChange = () => {
		const visibility =
			options.visibilityTarget?.visibilityState ??
			(typeof document === 'undefined' ? 'visible' : document.visibilityState);
		if (visibility === 'hidden') updateVisibility();
	};
	function updateVisibility(): void {
		void sync();
	}

	function start(): void {
		if (started || disposed || !platform.updateTodayWidgetSnapshot) return;
		started = true;
		subscribeEvents();
		options.visibilityTarget?.addEventListener('visibilitychange', onVisibilityChange);
		void sync();
	}

	function dispose(): void {
		if (disposed) return;
		disposed = true;
		for (const subscription of subscriptions) subscription.dispose();
		subscriptions.length = 0;
		options.visibilityTarget?.removeEventListener('visibilitychange', onVisibilityChange);
	}

	return { start, sync, dispose };
}
