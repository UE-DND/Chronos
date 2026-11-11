import type { Disposable } from '../types/env';
import type { Course } from '../domain/course';
import type { ChronosContext } from '../types/context';
import type { DeepReadonly } from '../types/readonly';
import type {
	CourseBadge,
	CourseBadgeSlotContribution,
	ReadonlyCourseBadges
} from '../types/slots';
import { immutableSnapshot } from './immutable-snapshot';

function evaluateBadgeForCourse(
	badge: CourseBadgeSlotContribution,
	course: DeepReadonly<Course>,
	ctx?: ChronosContext
): readonly DeepReadonly<CourseBadge>[] {
	if (!badge.getBadge) return [];
	try {
		const result = badge.getBadge(course, ctx as ChronosContext);
		if (!result) return [];
		return immutableSnapshot(Array.isArray(result) ? result : [result]);
	} catch (error) {
		console.error(`[BadgeManager] Error in badge provider "${badge.id}":`, error);
		return [];
	}
}

export class BadgeManager implements Disposable {
	private contributions = new Map<
		string,
		{ badge: CourseBadgeSlotContribution; ctx?: ChronosContext }
	>();
	private cache: ReadonlyCourseBadges = Object.freeze({});
	private courses: readonly DeepReadonly<Course>[] = Object.freeze([]);

	constructor(private onBadgesUpdated?: (badges: ReadonlyCourseBadges) => void) {}

	registerCourseBadge(badge: CourseBadgeSlotContribution, ctx?: ChronosContext): Disposable {
		this.contributions.set(badge.id, { badge, ctx });
		if (this.courses.length > 0) this.rebuild();
		return {
			dispose: () => {
				const current = this.contributions.get(badge.id);
				if (current?.badge === badge) {
					this.contributions.delete(badge.id);
					if (this.courses.length > 0) this.rebuild();
				}
			}
		};
	}

	async recalculate(courses: readonly DeepReadonly<Course>[]): Promise<ReadonlyCourseBadges> {
		this.courses = immutableSnapshot(courses);
		return this.rebuild();
	}

	private rebuild(): ReadonlyCourseBadges {
		if (this.contributions.size === 0) {
			if (Object.keys(this.cache).length > 0) {
				this.cache = Object.freeze({});
				this.onBadgesUpdated?.(this.cache);
			}
			return this.cache;
		}

		const nextBadges: Record<string, DeepReadonly<CourseBadge>[]> = {};

		for (const course of this.courses) {
			nextBadges[course.id] = [];
		}

		for (const { badge, ctx } of this.contributions.values()) {
			for (const course of this.courses) {
				nextBadges[course.id]?.push(...evaluateBadgeForCourse(badge, course, ctx));
			}
		}

		for (const badges of Object.values(nextBadges)) Object.freeze(badges);
		this.cache = Object.freeze(nextBadges);
		this.onBadgesUpdated?.(this.cache);
		return this.cache;
	}

	getAll(): ReadonlyCourseBadges {
		return this.cache;
	}

	dispose(): void {
		this.contributions.clear();
		this.cache = Object.freeze({});
		this.courses = Object.freeze([]);
	}
}
