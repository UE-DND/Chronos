import { AcademicCalendarService, todayIsoDate, type Course, type Timetable } from '@chronos/core';
import type { CourseDraft, PeriodTimeDraft, TimetableSettingsDraft } from '$lib/models/drafts';
import { courseScheduleFromCourse } from './course-schedule';

const academicCalendarService = new AcademicCalendarService();

export function courseToDraft(course: Course): CourseDraft {
	return {
		id: course.id,
		name: course.name,
		teacher: course.teacher,
		location: course.location,
		...courseScheduleFromCourse(course),
		remark: course.remark ?? ''
	};
}

export function toSettingsDraft(timetable: Timetable): TimetableSettingsDraft {
	return {
		name: timetable.name,
		academicConfig: {
			termStartDate: academicCalendarService.normalizeTermStartDate(
				timetable.academicConfig.termStartDate,
				todayIsoDate()
			),
			// Preserve the stored startWeek verbatim: week dates resolve as
			// termStart + (week - startWeek). Total-weeks editing keeps
			// the offset (endWeek = startWeek + total - 1).
			startWeek: timetable.academicConfig.startWeek,
			endWeek: timetable.academicConfig.endWeek,
			periodTimes: timetable.academicConfig.periodTimes.map((period) => ({
				index: period.index,
				startTime: period.startTime,
				endTime: period.endTime
			}))
		},
		importMetadata: {
			source: timetable.importMetadata?.source ?? 'UNKNOWN',
			campusId: timetable.importMetadata?.campusId
		}
	};
}

export function removePeriodAt(periodTimes: PeriodTimeDraft[], index: number): PeriodTimeDraft[] {
	return periodTimes.filter((_, currentIndex) => currentIndex !== index);
}

export function reindexPeriodTimes(periodTimes: PeriodTimeDraft[]): PeriodTimeDraft[] {
	return periodTimes.map((period, index) => ({ ...period, index: index + 1 }));
}
