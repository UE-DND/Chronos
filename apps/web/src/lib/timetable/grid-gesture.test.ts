import { describe, expect, it, vi } from 'vite-plus/test';
import { createCourse } from '@chronos/core';
import {
	createTimetableInteraction,
	TIMETABLE_POINTER_THRESHOLD_PX
} from './timetable-interaction.svelte';

function createMockElement(closestMatch: string | null = null) {
	return {
		closest: (selector: string) => {
			if (!closestMatch) return null;
			return selector.includes(closestMatch) ? {} : null;
		}
	};
}

function mockPointerEvent(init: Partial<PointerEvent> = {}): PointerEvent {
	return {
		isPrimary: true,
		button: 0,
		pointerId: 1,
		clientX: 0,
		clientY: 0,
		target: createMockElement(),
		preventDefault: () => {},
		stopPropagation: () => {},
		...init
	} as unknown as PointerEvent;
}

function mockMouseEvent(init: Partial<MouseEvent> = {}): MouseEvent {
	return {
		button: 0,
		target: createMockElement(),
		preventDefault: () => {},
		stopPropagation: () => {},
		...init
	} as unknown as MouseEvent;
}

function createHarness() {
	const interaction = createTimetableInteraction({
		longPressDelayMs: 400
	});
	const onClickEmpty = vi.fn(() => {
		interaction.exitEdit();
	});
	const handlers = interaction.createGridHandlers({
		onClickEmpty
	});
	return { interaction, handlers, onClickEmpty };
}

describe('createGridHandlers', () => {
	it('exits on the first empty touch tap after a long press even when WebKit emits no click', () => {
		vi.useFakeTimers();
		try {
			const { interaction, handlers, onClickEmpty } = createHarness();
			const touch = mockPointerEvent({ pointerType: 'touch', clientX: 50, clientY: 50 });
			handlers.onpointerdown(touch);
			vi.advanceTimersByTime(400);
			handlers.onpointerup(touch);
			expect(interaction.isEditing).toBe(true);
			expect(onClickEmpty).not.toHaveBeenCalled();

			handlers.onpointerdown(touch);
			handlers.onpointerup(touch);
			expect(interaction.isEditing).toBe(false);
			expect(onClickEmpty).toHaveBeenCalledTimes(1);
			// Browsers that also synthesize a click must not activate the action twice.
			handlers.onclick(mockMouseEvent());
			expect(onClickEmpty).toHaveBeenCalledTimes(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it.each(['move', 'release-away', 'cancel', 'leave'] as const)(
		'keeps editing after a touch %s instead of treating it as an empty tap',
		(action) => {
			const { interaction, handlers, onClickEmpty } = createHarness();
			interaction.enterEdit();
			const touch = mockPointerEvent({ pointerType: 'touch' });
			const moved = mockPointerEvent({ pointerType: 'touch', clientY: 40 });
			handlers.onpointerdown(touch);
			if (action === 'move') handlers.onpointermove(moved);
			if (action === 'cancel') handlers.onpointercancel(touch);
			if (action === 'leave') handlers.onpointerleave(touch);
			handlers.onpointerup(action === 'release-away' ? moved : touch);
			handlers.onclick(mockMouseEvent({ detail: 1 }));
			expect(interaction.isEditing).toBe(true);
			expect(onClickEmpty).not.toHaveBeenCalled();
		}
	);

	it('only lets the primary touch that started an empty tap finish it', () => {
		const { interaction, handlers, onClickEmpty } = createHarness();
		interaction.enterEdit();
		const primary = mockPointerEvent({ pointerType: 'touch' });
		const secondary = mockPointerEvent({ pointerType: 'touch', pointerId: 2, isPrimary: false });
		handlers.onpointerdown(primary);
		handlers.onpointerdown(secondary);
		handlers.onpointerup(secondary);
		expect(interaction.isEditing).toBe(true);
		handlers.onpointerup(primary);
		expect(interaction.isEditing).toBe(false);
		expect(onClickEmpty).toHaveBeenCalledTimes(1);
	});

	it.each(['button', '.course-capsule'])('does not exit on a touch tap inside %s', (selector) => {
		const { interaction, handlers, onClickEmpty } = createHarness();
		interaction.enterEdit();
		const touch = mockPointerEvent({
			pointerType: 'touch',
			target: createMockElement(selector) as unknown as EventTarget
		});
		handlers.onpointerdown(touch);
		handlers.onpointerup(touch);
		expect(interaction.isEditing).toBe(true);
		expect(onClickEmpty).not.toHaveBeenCalled();
	});

	it('triggers enterEditFromLongPress after delay and suppresses subsequent click', () => {
		vi.useFakeTimers();
		try {
			const { handlers, onClickEmpty, interaction } = createHarness();

			const downEvt = mockPointerEvent({ clientX: 50, clientY: 50 });
			handlers.onpointerdown(downEvt);

			expect(interaction.isEditing).toBe(false);

			vi.advanceTimersByTime(400);
			expect(interaction.isEditing).toBe(true);

			handlers.onpointerup(mockPointerEvent({ clientX: 50, clientY: 50 }));
			handlers.onclick(mockMouseEvent());
			expect(onClickEmpty).not.toHaveBeenCalled();

			handlers.onclick(mockMouseEvent());
			expect(onClickEmpty).toHaveBeenCalledTimes(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it('exits edit mode on the very first click after long press when no click was fired on pointerup (touch/mobile)', () => {
		vi.useFakeTimers();
		try {
			const { handlers, onClickEmpty, interaction } = createHarness();

			const downEvt = mockPointerEvent({ clientX: 50, clientY: 50 });
			handlers.onpointerdown(downEvt);
			vi.advanceTimersByTime(400);
			expect(interaction.isEditing).toBe(true);

			handlers.onpointerup(mockPointerEvent({ clientX: 50, clientY: 50 }));

			handlers.onpointerdown(mockPointerEvent({ clientX: 100, clientY: 100 }));
			handlers.onpointerup(mockPointerEvent({ clientX: 100, clientY: 100 }));
			handlers.onclick(mockMouseEvent());

			expect(onClickEmpty).toHaveBeenCalledTimes(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it('clears longPressFired after release timer even if next click has no pointerdown', () => {
		vi.useFakeTimers();
		try {
			const { handlers, onClickEmpty, interaction } = createHarness();

			const downEvt = mockPointerEvent({ clientX: 50, clientY: 50 });
			handlers.onpointerdown(downEvt);
			vi.advanceTimersByTime(400);
			expect(interaction.isEditing).toBe(true);

			handlers.onpointerup(mockPointerEvent({ clientX: 50, clientY: 50 }));
			vi.advanceTimersByTime(60);

			handlers.onclick(mockMouseEvent());
			expect(onClickEmpty).toHaveBeenCalledTimes(1);
		} finally {
			vi.useRealTimers();
		}
	});

	it('cancels long press when pointer moves beyond drag threshold', () => {
		vi.useFakeTimers();
		try {
			const { handlers, interaction } = createHarness();

			handlers.onpointerdown(mockPointerEvent({ clientX: 50, clientY: 50 }));
			vi.advanceTimersByTime(200);

			handlers.onpointermove(
				mockPointerEvent({
					clientX: 50 + TIMETABLE_POINTER_THRESHOLD_PX + 2,
					clientY: 50
				})
			);
			vi.advanceTimersByTime(300);

			expect(interaction.isEditing).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('cancels long press on pointerup before delay', () => {
		vi.useFakeTimers();
		try {
			const { handlers, interaction } = createHarness();

			handlers.onpointerdown(mockPointerEvent({ clientX: 50, clientY: 50 }));
			vi.advanceTimersByTime(200);
			handlers.onpointerup(mockPointerEvent({ clientX: 50, clientY: 50 }));

			vi.advanceTimersByTime(300);
			expect(interaction.isEditing).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('cancels long press on pointercancel or pointerleave', () => {
		vi.useFakeTimers();
		try {
			const { handlers, interaction } = createHarness();

			handlers.onpointerdown(mockPointerEvent({ clientX: 50, clientY: 50 }));
			vi.advanceTimersByTime(200);
			handlers.onpointercancel(mockPointerEvent({ clientX: 50, clientY: 50 }));

			vi.advanceTimersByTime(300);
			expect(interaction.isEditing).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('ignores target that is inside a course-capsule', () => {
		vi.useFakeTimers();
		try {
			const { handlers, interaction } = createHarness();

			const capsuleTarget = createMockElement('.course-capsule');
			handlers.onpointerdown(
				mockPointerEvent({
					target: capsuleTarget as unknown as EventTarget,
					clientX: 50,
					clientY: 50
				})
			);
			vi.advanceTimersByTime(500);

			expect(interaction.isEditing).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('does not start long press timer when already in editing mode', () => {
		vi.useFakeTimers();
		try {
			const { interaction, handlers } = createHarness();
			interaction.enterEdit();

			handlers.onpointerdown(mockPointerEvent({ clientX: 50, clientY: 50 }));
			vi.advanceTimersByTime(500);

			expect(interaction.isEditing).toBe(true);
		} finally {
			vi.useRealTimers();
		}
	});

	it('does not exit edit mode when clicking on a button or capsule in edit mode', () => {
		const { interaction, handlers, onClickEmpty } = createHarness();
		interaction.enterEdit();

		const buttonTarget = createMockElement('button');
		handlers.onclick(mockMouseEvent({ target: buttonTarget as unknown as EventTarget }));
		expect(onClickEmpty).not.toHaveBeenCalled();

		const capsuleTarget = createMockElement('.course-capsule');
		handlers.onclick(mockMouseEvent({ target: capsuleTarget as unknown as EventTarget }));
		expect(onClickEmpty).not.toHaveBeenCalled();
	});

	it('ignores non-primary pointer button', () => {
		vi.useFakeTimers();
		try {
			const { handlers, interaction } = createHarness();

			handlers.onpointerdown(mockPointerEvent({ button: 2, clientX: 50, clientY: 50 }));
			vi.advanceTimersByTime(500);

			expect(interaction.isEditing).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});

	it('suppresses click and does not exit edit mode while a drag click-guard is active', () => {
		let now = 1_000;
		const interaction = createTimetableInteraction({
			now: () => now,
			clickGuardMs: 120
		});
		const onClickEmpty = vi.fn(() => {
			interaction.exitEdit();
		});
		const handlers = interaction.createGridHandlers({
			onClickEmpty
		});
		interaction.enterEdit();
		interaction.beginDrag({
			course: createCourse({
				id: 'course-1',
				name: '高等数学',
				dayOfWeek: 1,
				startPeriod: 1,
				endPeriod: 2,
				weeks: [1]
			}),
			placed: {} as never,
			pointerId: 1,
			week: 1,
			targetColIndex: 0,
			targetDayOfWeek: 1,
			targetStartPeriod: 1,
			persistAfterDrop: true
		});

		handlers.onclick(mockMouseEvent());
		expect(onClickEmpty).not.toHaveBeenCalled();

		interaction.endDrag();
		handlers.onclick(mockMouseEvent());
		expect(onClickEmpty).not.toHaveBeenCalled();

		now = 1_120;
		handlers.onclick(mockMouseEvent());
		expect(onClickEmpty).toHaveBeenCalledTimes(1);
	});
});
