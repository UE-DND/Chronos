import { trackEvent } from '#lib/client/analytics.ts';

export const courseDetailState = $state<{
	open: boolean;
	courseId: string | null;
	timetableId: string | null;
}>({ open: false, courseId: null, timetableId: null });

export function openCourseDetail(courseId: string, timetableId?: string): void {
	courseDetailState.courseId = courseId;
	courseDetailState.timetableId = timetableId ?? null;
	courseDetailState.open = true;
	trackEvent('course_detail_open');
}
