import { describe, expect, it } from 'vite-plus/test';
import { createLongPressDemo } from './long-press-demo.svelte';

function harness() {
	return createLongPressDemo(() => ({ primary: '高等数学', secondary: '大学英语' }));
}
const pointer = { pointerId: 1, clientX: 0, clientY: 0 } as PointerEvent;

describe('onboarding long press rehearsal', () => {
	it('releases a stationary long press into edit mode, then moves only this week', async () => {
		const demo = harness();
		demo.hold(pointer);
		expect(demo.interaction.mode).toBe('dragging');
		await demo.release();
		expect(demo.interaction.mode).toBe('edit');
		expect(demo.state.timetable.courses).toHaveLength(2);
		demo.beginDrag(pointer);
		demo.moveTo(2, 1);
		await demo.release();
		expect(demo.interaction.mode).toBe('edit');
		expect(
			demo.state.layout.courseDisplayModels.find((entry) => entry.course.name === '高等数学')
				?.course.dayOfWeek
		).toBe(2);
		expect(
			demo.state.timetable.courses.find(
				(course) => course.name === '高等数学' && course.weeks.includes(2)
			)?.dayOfWeek
		).toBe(1);
		demo.destroy();
	});

	it('continuous dragging from view returns to view after landing', async () => {
		const demo = harness();
		demo.hold(pointer);
		demo.interaction.notePointerMove({ pointerId: 1, clientX: 30, clientY: 0 } as PointerEvent);
		demo.moveTo(2, 1);
		await demo.release();
		expect(demo.interaction.mode).toBe('view');
		expect(
			demo.state.layout.courseDisplayModels.find((entry) => entry.course.name === '高等数学')
				?.course.dayOfWeek
		).toBe(2);
		demo.destroy();
	});

	it('keeps the course until confirmation, supports cancellation and deletes only this week', async () => {
		const demo = harness();
		demo.hold(pointer);
		await demo.release();
		demo.beginDrag(pointer);
		demo.overDelete();
		await demo.release();
		expect(demo.state.pendingDelete?.name).toBe('高等数学');
		expect(demo.state.layout.courseDisplayModels).toHaveLength(2);
		demo.cancelDelete();
		expect(demo.state.pendingDelete).toBeNull();
		expect(demo.state.layout.courseDisplayModels).toHaveLength(2);
		demo.beginDrag(pointer);
		demo.overDelete();
		await demo.release();
		demo.confirmDelete();
		expect(demo.state.layout.courseDisplayModels.map((entry) => entry.course.name)).toEqual([
			'大学英语'
		]);
		expect(
			demo.state.timetable.courses.find((course) => course.name === '高等数学')?.weeks
		).toEqual([2]);
		demo.reset();
		expect(demo.interaction.mode).toBe('view');
		expect(demo.state.pendingDelete).toBeNull();
		expect(demo.state.timetable.courses).toHaveLength(2);
		demo.destroy();
	});
});
