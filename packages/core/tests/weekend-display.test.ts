import { describe, expect, it } from 'vite-plus/test';
import {
	AcademicCalendarService,
	computeTimetableWeekLayout,
	createCourse,
	createTimetable,
	formatWeekDateRange
} from '../src/index';

function timetableWithPrefs(showSaturday = false, showSunday = false) {
	return createTimetable({
		id: 'weekend-display',
		name: '周末显示',
		academicConfig: {
			termStartDate: '2026-03-02',
			startWeek: 1,
			endWeek: 3,
			periodTimes: [{ index: 1, startTime: '08:00', endTime: '08:45' }]
		},
		viewPrefs: { showSaturday, showSunday, showNonCurrentWeekCourses: false },
		courses: [6, 7].map((dayOfWeek) =>
			createCourse({
				id: `weekend-${dayOfWeek}`,
				name: `周末课程-${dayOfWeek}`,
				dayOfWeek,
				startPeriod: 1,
				endPeriod: 1,
				weeks: [1, 2, 3]
			})
		)
	});
}

describe('temporary weekend display', () => {
	for (const showSaturday of [false, true]) {
		for (const showSunday of [false, true]) {
			for (let weekday = 1; weekday <= 7; weekday++) {
				it(`merges weekday ${weekday} with Saturday=${showSaturday}, Sunday=${showSunday}`, () => {
					const timetable = timetableWithPrefs(showSaturday, showSunday);
					const savedPrefs = { ...timetable.viewPrefs };
					const todayIso = `2026-03-0${weekday + 1}`;
					const days = [1, 2, 3, 4, 5];
					if (showSaturday || weekday >= 6) days.push(6);
					if (showSunday || weekday === 7) days.push(7);
					const layout = computeTimetableWeekLayout({ timetable, displayedWeek: 1, todayIso });

					expect(layout.gridModel.visibleDays.map((day) => day.dayOfWeek)).toEqual(days);
					expect(layout.gridModel.visibleDays.find((day) => day.isToday)?.date).toBe(todayIso);
					const expectedRange = `03/02 - 03/0${days.at(-1)! + 1}`;
					expect(layout.weekRangeText).toBe(expectedRange);
					expect(
						formatWeekDateRange(timetable.academicConfig, 1, todayIso, timetable.viewPrefs)
					).toBe(expectedRange);
					expect(layout.courseDisplayModels.map((model) => model.course.dayOfWeek)).toEqual(
						days.filter((day) => day >= 6)
					);
					expect(layout.placements).toHaveLength(days.filter((day) => day >= 6).length);
					for (const item of layout.placements) {
						expect(item.kind).toBe('course');
						if (item.kind === 'course') {
							expect(item.geometry.leftPercent).toBeCloseTo(
								(days.indexOf(item.course.dayOfWeek) * 100) / days.length
							);
						}
					}
					expect(timetable.viewPrefs).toEqual(savedPrefs);
				});
			}
		}
	}

	it.each([false, true])(
		'uses only saved preferences for other weeks (Sunday=%s)',
		(showSunday) => {
			const timetable = timetableWithPrefs(false, showSunday);
			for (const displayedWeek of [1, 3]) {
				const layout = computeTimetableWeekLayout({
					timetable,
					displayedWeek,
					todayIso: '2026-03-15'
				});
				expect(layout.gridModel.visibleDays.map((day) => day.dayOfWeek)).toEqual(
					showSunday ? [1, 2, 3, 4, 5, 7] : [1, 2, 3, 4, 5]
				);
				expect(layout.gridModel.visibleDays.some((day) => day.isToday)).toBe(false);
			}
		}
	);

	it.each(['2026-03-01', '2026-03-29'])(
		'does not force weekends outside the term on %s',
		(todayIso) => {
			const timetable = timetableWithPrefs();
			const displayedWeek = new AcademicCalendarService().calculateAcademicWeek(
				todayIso,
				timetable.academicConfig
			);
			const layout = computeTimetableWeekLayout({ timetable, displayedWeek, todayIso });
			expect(layout.gridModel.visibleDays.map((day) => day.dayOfWeek)).toEqual([1, 2, 3, 4, 5]);
		}
	);

	it('updates the month and date range when temporary weekend columns cross a month boundary', () => {
		const timetable = timetableWithPrefs();
		timetable.academicConfig.termStartDate = '2026-01-26';
		for (const [todayIso, count, month, range] of [
			['2026-01-30', 5, '1', '01/26 - 01/30'],
			['2026-01-31', 6, '1', '01/26 - 01/31'],
			['2026-02-01', 7, '1/2', '01/26 - 02/01'],
			['2026-02-02', 5, '1', '01/26 - 01/30']
		] as const) {
			const layout = computeTimetableWeekLayout({ timetable, displayedWeek: 1, todayIso });
			expect(layout.gridModel.visibleDays).toHaveLength(count);
			expect(layout.gridModel.monthLabel).toBe(month);
			expect(layout.weekRangeText).toBe(range);
		}
	});
});
