import { describe, it, expect, vi } from 'vite-plus/test';
import { BadgeManager } from '../src/runtime/badge-manager';
import { createCourse } from '../src/domain/course';
import type { CourseBadge, CourseBadgeSlotContribution } from '../src/types/slots';

describe('BadgeManager in @chronos/core', () => {
	it('calculates badges from registered slot contributions', async () => {
		const onUpdated = vi.fn();
		const manager = new BadgeManager(onUpdated);

		const labBadgeProvider: CourseBadgeSlotContribution = {
			id: 'lab-badge',
			getBadge(course) {
				if (course.name.includes('实验')) {
					return { id: 'lab', text: '实验课', colorScheme: 'warning' };
				}
				return null;
			}
		};

		const profBadgeProvider: CourseBadgeSlotContribution = {
			id: 'prof-badge',
			getBadge(course) {
				if (course.teacher.includes('教授')) {
					return { id: 'prof', text: '教授授课', colorScheme: 'primary' };
				}
				return null;
			}
		};

		manager.registerCourseBadge(labBadgeProvider);
		manager.registerCourseBadge(profBadgeProvider);

		const courses = [
			createCourse({
				id: 'c1',
				name: '物理实验',
				teacher: '张教授',
				location: '实验楼A101',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 2
			}),
			createCourse({
				id: 'c2',
				name: '高等数学',
				teacher: '李老师',
				location: '弘远楼B204',
				dayOfWeek: 2,
				startPeriod: 1,
				endPeriod: 2
			})
		];

		const badges = await manager.recalculate(courses);

		expect(onUpdated).toHaveBeenCalledWith(badges);
		expect(badges['c1']).toEqual([
			{ id: 'lab', text: '实验课', colorScheme: 'warning' },
			{ id: 'prof', text: '教授授课', colorScheme: 'primary' }
		]);
		expect(badges['c2']).toEqual([]);
		expect(manager.getAll()['c1']).toEqual([
			{ id: 'lab', text: '实验课', colorScheme: 'warning' },
			{ id: 'prof', text: '教授授课', colorScheme: 'primary' }
		]);
	});

	it('unregisters badge provider', async () => {
		const manager = new BadgeManager();
		const provider: CourseBadgeSlotContribution = {
			id: 'temp',
			getBadge: () => ({ id: 't', text: '临时' })
		};

		const sub = manager.registerCourseBadge(provider);
		await manager.recalculate([]);

		sub.dispose();
		expect(Object.keys(manager.getAll())).toHaveLength(0);
	});

	it('clears published badges when the last provider is unregistered', async () => {
		const onUpdated = vi.fn();
		const manager = new BadgeManager(onUpdated);
		const provider = manager.registerCourseBadge({
			id: 'last-provider',
			getBadge: () => ({ id: 'badge', text: 'Original' })
		});
		const previous = await manager.recalculate([
			createCourse({ id: 'course', name: 'Course', dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
		]);
		onUpdated.mockClear();

		provider.dispose();
		expect(manager.getAll()).toEqual({});
		expect(onUpdated).toHaveBeenCalledWith(manager.getAll());
		expect(previous.course?.[0]?.text).toBe('Original');
		expect(Object.isFrozen(manager.getAll())).toBe(true);
		await manager.recalculate([]);
		expect(onUpdated).toHaveBeenCalledTimes(1);
	});

	it('recalculates remaining providers from the last owned course snapshot', async () => {
		const manager = new BadgeManager();
		const first = manager.registerCourseBadge({
			id: 'first',
			getBadge: (course) => ({ id: 'first', text: course.name })
		});
		manager.registerCourseBadge({
			id: 'second',
			getBadge: (course) => ({ id: 'second', text: course.name })
		});
		const course = createCourse({
			id: 'course',
			name: 'Original',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});
		await manager.recalculate([course]);
		course.name = 'Caller edit';

		first.dispose();
		expect(manager.getAll().course).toEqual([{ id: 'second', text: 'Original' }]);
	});

	it('calculates a newly registered provider for already accepted courses', async () => {
		const onUpdated = vi.fn();
		const manager = new BadgeManager(onUpdated);
		const course = createCourse({
			id: 'course',
			name: 'Original',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1
		});
		await manager.recalculate([course]);
		course.name = 'Caller edit';
		manager.registerCourseBadge({
			id: 'new-provider',
			getBadge: (view) => ({ id: 'badge', text: view.name })
		});
		expect(manager.getAll().course).toEqual([{ id: 'badge', text: 'Original' }]);
		expect(onUpdated).toHaveBeenCalledWith(manager.getAll());
	});

	it('owns each accepted badge result and publishes frozen views', async () => {
		const onUpdated = vi.fn();
		const manager = new BadgeManager(onUpdated);
		const reusedBadge: CourseBadge = { id: 'badge', text: '' };
		manager.registerCourseBadge({
			id: 'reused',
			getBadge(course) {
				reusedBadge.text = course.name;
				return reusedBadge;
			}
		});
		const courses = ['First', 'Second'].map((name, index) =>
			createCourse({ id: `c${index}`, name, dayOfWeek: 1, startPeriod: 1, endPeriod: 1 })
		);
		const badges = await manager.recalculate(courses);

		reusedBadge.text = 'Provider edit';
		expect(badges.c0?.[0]?.text).toBe('First');
		expect(badges.c1?.[0]?.text).toBe('Second');
		expect(manager.getAll()).toBe(badges);
		expect(onUpdated).toHaveBeenCalledWith(badges);
		expect(Reflect.set(badges, 'c0', [])).toBe(false);
		expect(Reflect.set(badges.c0!, '0', { id: 'other', text: 'Consumer edit' })).toBe(false);
		expect(Reflect.set(badges.c0![0]!, 'text', 'Consumer edit')).toBe(false);
		expect(manager.getAll().c0?.[0]?.text).toBe('First');
	});

	it('passes owned frozen courses to providers', async () => {
		const manager = new BadgeManager();
		const course = createCourse({
			id: 'c1',
			name: 'Original',
			dayOfWeek: 1,
			startPeriod: 1,
			endPeriod: 1,
			weeks: [1, 2]
		});
		const attemptedWrites: boolean[] = [];
		manager.registerCourseBadge({
			id: 'attempted-write',
			getBadge(view) {
				attemptedWrites.push(Reflect.set(view, 'name', 'Provider edit'));
				attemptedWrites.push(Reflect.set(view.weeks, '0', 99));
				return { id: 'original', text: view.name };
			}
		});

		const badges = await manager.recalculate([course]);
		expect(attemptedWrites).toEqual([false, false]);
		expect(badges.c1?.[0]?.text).toBe('Original');
		expect(course.name).toBe('Original');
		expect(course.weeks).toEqual([1, 2]);
	});

	it('skips aggregation when no contributors are registered', async () => {
		const onUpdated = vi.fn();
		const manager = new BadgeManager(onUpdated);
		const badges = await manager.recalculate([
			createCourse({
				id: 'c1',
				name: 'Math',
				teacher: '',
				location: '',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 2,
				weeks: [1]
			})
		]);
		expect(badges).toEqual({});
		expect(onUpdated).not.toHaveBeenCalled();
	});
});
