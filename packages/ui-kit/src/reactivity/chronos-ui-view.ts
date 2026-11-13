import type { ChronosUiView } from './chronos-ui-controller';
import type { ChronosContext, ReadonlyTimetable } from '@chronos/core';

/** Construct the object crossing the plugin boundary explicitly; never expose the host controller. */
export function createChronosUiView(
	source: ChronosUiView,
	context?: Pick<ChronosContext, 'signal' | 'addDisposable'>
): ChronosUiView {
	const snapshot = Object.freeze<ChronosUiView['snapshot']>({
		subscribe(run, invalidate) {
			if (context?.signal.aborted) throw new Error('Plugin instance stopped');
			const unsubscribe = source.snapshot.subscribe(
				(value) => run(Object.freeze({ ...value, now: new Date(value.now) })),
				invalidate
			);
			let released = false;
			const release = () => {
				if (released) return;
				released = true;
				unsubscribe();
				context?.signal.removeEventListener('abort', release);
			};
			context?.signal.addEventListener('abort', release, { once: true });
			context?.addDisposable({ dispose: release });
			return release;
		}
	});
	const history = source.overlayHistoryPort;
	const overlayHistoryPort =
		history &&
		Object.freeze({
			openOverlay(id: string, dismiss: () => void) {
				if (context?.signal.aborted) throw new Error('Plugin instance stopped');
				const handle = history.openOverlay(id, dismiss);
				let released = false;
				const publicHandle = Object.freeze({
					close() {
						if (!released) {
							released = true;
							handle.close();
						}
					},
					dispose() {
						if (!released) {
							released = true;
							handle.dispose();
						}
					}
				});
				context?.addDisposable(publicHandle);
				return publicHandle;
			}
		});
	return Object.freeze({
		get snapshot() {
			return snapshot;
		},
		overlayHistoryPort,
		get currentTimetable() {
			return source.currentTimetable;
		},
		get timetables() {
			return source.timetables;
		},
		get activeWeek() {
			return source.activeWeek;
		},
		get currentPeriodIndex() {
			return source.currentPeriodIndex;
		},
		get activeThemeId() {
			return source.activeThemeId;
		},
		get activeIconThemeId() {
			return source.activeIconThemeId;
		},
		get userPreferences() {
			return source.userPreferences;
		},
		get locale() {
			return source.locale;
		},
		get now() {
			return new Date(source.now);
		},
		get todayIso() {
			return source.todayIso;
		},
		get clockFrozen() {
			return source.clockFrozen;
		},
		get slotVersion() {
			return source.slotVersion;
		},
		get courseBadges() {
			return source.courseBadges;
		},
		get coursePaletteRevision() {
			return source.coursePaletteRevision;
		},
		get calendarRevision() {
			return source.calendarRevision;
		},
		resolveHolidays: (timetable: ReadonlyTimetable) => source.resolveHolidays(timetable),
		translatePlugin: (pluginId: string, key: string, params?: Record<string, unknown>) =>
			source.translatePlugin(pluginId, key, params)
	});
}
