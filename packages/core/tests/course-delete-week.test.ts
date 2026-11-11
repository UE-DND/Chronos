import { describe, expect, it } from 'vite-plus/test';
import { createCourse } from '@chronos/core';
import { deleteCourseForWeek } from '../src';

describe('deleteCourseForWeek', () => {
	const multiWeekCourse = createCourse({
		id: 'course-a',
		name: '高等数学',
		dayOfWeek: 1,
		startPeriod: 1,
		endPeriod: 2,
		weeks: [1, 2, 3, 4]
	});

	const singleWeekCourse = createCourse({
		id: 'course-single',
		name: '单周讲座',
		dayOfWeek: 1,
		startPeriod: 1,
		endPeriod: 2,
		weeks: [2]
	});

	const allWeeksCourse = createCourse({
		id: 'course-all',
		name: '通识课',
		dayOfWeek: 3,
		startPeriod: 5,
		endPeriod: 6,
		weeks: []
	});

	it('removes a single-week course row entirely', () => {
		const result = deleteCourseForWeek({
			currentCourses: [singleWeekCourse, multiWeekCourse],
			courseId: 'course-single',
			currentWeek: 2
		});

		expect(result).not.toBeNull();
		expect(result).toHaveLength(1);
		expect(result!.some((course) => course.id === 'course-single')).toBe(false);
	});

	it('removes only currentWeek from a multi-week course', () => {
		const result = deleteCourseForWeek({
			currentCourses: [multiWeekCourse],
			courseId: 'course-a',
			currentWeek: 2
		});

		expect(result).not.toBeNull();
		expect(result).toHaveLength(1);
		expect(result![0]!.weeks).toEqual([1, 3, 4]);
	});

	it('returns editable metadata owned independently of mutable or frozen input courses', () => {
		for (const frozen of [false, true]) {
			const metadata = { plugin: { tags: ['original'], nested: { label: 'original' } } };
			if (frozen) {
				Object.freeze(metadata.plugin.tags);
				Object.freeze(metadata.plugin.nested);
				Object.freeze(metadata.plugin);
				Object.freeze(metadata);
			}
			const source = createCourse({
				...multiWeekCourse,
				weeks: [1, 2],
				customMetadata: metadata
			});
			const untouched = createCourse({ ...allWeeksCourse, customMetadata: metadata });
			const result = deleteCourseForWeek({
				currentCourses: [source, untouched],
				courseId: source.id,
				currentWeek: 2
			})!;
			expect(result).toHaveLength(2);
			for (const course of result) {
				const copied = course.customMetadata!.plugin as typeof metadata.plugin;
				copied.tags.push('edited');
				copied.nested.label = 'edited';
			}
			expect(metadata.plugin).toEqual({ tags: ['original'], nested: { label: 'original' } });
			expect(source.weeks).toEqual([1, 2]);
		}
	});

	it('removes one week from an all-semester course', () => {
		const result = deleteCourseForWeek({
			currentCourses: [allWeeksCourse],
			courseId: 'course-all',
			currentWeek: 2,
			totalWeeks: { startWeek: 1, endWeek: 4 }
		});

		expect(result).not.toBeNull();
		expect(result![0]!.weeks).toEqual([1, 3, 4]);
	});

	it('returns null when the course is not scheduled in currentWeek', () => {
		const result = deleteCourseForWeek({
			currentCourses: [singleWeekCourse],
			courseId: 'course-single',
			currentWeek: 3
		});

		expect(result).toBeNull();
	});

	it('returns null when the course id does not exist', () => {
		const result = deleteCourseForWeek({
			currentCourses: [multiWeekCourse],
			courseId: 'missing',
			currentWeek: 2
		});

		expect(result).toBeNull();
	});
});
