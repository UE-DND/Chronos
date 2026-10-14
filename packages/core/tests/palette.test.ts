import { describe, it, expect } from 'vite-plus/test';
import {
	normalizedCourseName,
	coursePalette,
	assignCourseDisplayColors,
	lookupCoursePaint
} from '../src/index';

describe('Palette Algorithm in @chronos/core', () => {
	it('normalizes course name by removing prefixes and markers', () => {
		expect(normalizedCourseName('【调】大学英语★')).toBe('大学英语');
		expect(normalizedCourseName(' 软件工程   原理 ')).toBe('软件工程 原理');
	});

	it('derives stable course palette by name', () => {
		const [bg1, fg1] = coursePalette('高等数学');
		const [bg2, fg2] = coursePalette('高等数学');
		expect(bg1).toBe(bg2);
		expect(fg1).toBe(fg2);
	});

	it('assigns course display colors across palette evenly', () => {
		const courses = [{ name: '高等数学' }, { name: '线性代数' }, { name: '大学物理' }];

		const assigned = assignCourseDisplayColors(courses);
		expect(assigned.size).toBe(3);
	});

	it('assigns distinct display colors when enough courses are present', () => {
		const courses = [{ name: '高等数学' }, { name: '线性代数' }, { name: '大学物理' }];

		const assigned = assignCourseDisplayColors(courses);
		const backgrounds = new Set([...assigned.values()].map((entry) => entry.background));
		expect(backgrounds.size).toBe(3);
	});

	it('lookupCoursePaint falls back when name is missing from lookup', () => {
		const lookup = assignCourseDisplayColors([{ name: '高等数学' }]);
		const paint = lookupCoursePaint(lookup, { name: '线性代数' });
		expect(paint.background).toBeTruthy();
	});
	it('keeps deterministic collision handling when normalized duplicates outnumber the palette', () => {
		const names = [
			'高等数学',
			'线性代数',
			'大学物理',
			'大学英语',
			'操作系统',
			'高等数学☆',
			'  软件工程   原理 ',
			'软件工程 原理',
			''
		];
		const palette = ['red', 'green', 'blue'].map((background) => ({
			background,
			foreground: 'ink'
		}));
		const courses = names.map((name) => ({ name }));
		const assigned = assignCourseDisplayColors(courses, palette);
		expect([...assigned].map(([name, paint]) => [name, paint.background])).toEqual([
			['软件工程 原理', 'red'],
			['大学物理', 'green'],
			['线性代数', 'blue'],
			['', 'red'],
			['大学英语', 'green'],
			['操作系统', 'blue'],
			['高等数学', 'red']
		]);
		expect(assignCourseDisplayColors([...courses].reverse(), palette)).toEqual(assigned);
		expect(assignCourseDisplayColors(courses, [])).toEqual(new Map());
	});
});
