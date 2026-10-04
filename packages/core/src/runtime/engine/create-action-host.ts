import type { EngineActionHost } from './engine-action-host';

export function createEngineActionHost(source: EngineActionHost): EngineActionHost {
	return {
		storage: source.storage,
		events: source.events,
		badges: source.badges,
		themes: source.themes,
		getCurrentTimetable: () => source.getCurrentTimetable(),
		setCurrentTimetable: (timetable) => source.setCurrentTimetable(timetable),
		getTimetables: () => source.getTimetables(),
		setTimetables: (timetables) => source.setTimetables(timetables),
		getUserPreferences: () => source.getUserPreferences(),
		setUserPreferences: (preferences) => source.setUserPreferences(preferences),
		getActiveThemeId: () => source.getActiveThemeId(),
		setActiveThemeId: (themeId) => source.setActiveThemeId(themeId),
		getLocale: () => source.getLocale(),
		setLocale: (locale) => source.setLocale(locale),
		refreshTimetables: () => source.refreshTimetables(),
		updateTime: (now) => source.updateTime(now),
		rescheduleDayClock: () => source.rescheduleDayClock(),
		emitIconThemeChanged: () => source.emitIconThemeChanged(),
		switchTimetable: (id) => source.switchTimetable(id),
		updateTimetableDetails: (id, patch) => source.updateTimetableDetails(id, patch),
		updatePreferences: (patch) => source.updatePreferences(patch),
		emit: (event, payload) => source.emit(event, payload)
	};
}
