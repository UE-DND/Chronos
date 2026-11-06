import { hasClosest } from './timetable-dom-utils';
import {
	TIMETABLE_POINTER_THRESHOLD_PX,
	type GridHandlerOptions,
	type TimetableInteractionCore
} from './timetable-interaction-types';

function isEmptyTarget(target: EventTarget | null): boolean {
	return !hasClosest(target) || !target.closest('.course-capsule, button');
}

export function createGridHandlers(
	interaction: TimetableInteractionCore,
	options: GridHandlerOptions = {},
	thresholdPx = TIMETABLE_POINTER_THRESHOLD_PX
) {
	const { onEmptyLongPress, onClickEmpty } = options;
	let emptyTap: { pointerId: number; x: number; y: number } | null = null;
	let suppressTouchClick = false;

	function cancelMovedTap(event: PointerEvent) {
		if (
			emptyTap?.pointerId === event.pointerId &&
			(Math.abs(event.clientX - emptyTap.x) > thresholdPx ||
				Math.abs(event.clientY - emptyTap.y) > thresholdPx)
		) {
			emptyTap = null;
		}
	}

	return {
		onpointerdown: (event: PointerEvent) => {
			if (event.button !== 0 || !event.isPrimary) return;
			emptyTap = null;
			suppressTouchClick = false;
			interaction.resetClickFlags();
			if (interaction.isClickGuarded() || !isEmptyTarget(event.target)) return;
			if (interaction.mode === 'edit' && event.pointerType === 'touch') {
				emptyTap = { pointerId: event.pointerId, x: event.clientX, y: event.clientY };
				suppressTouchClick = true;
			}
			if (interaction.mode !== 'view') return;

			interaction.watchLongPress(event, (pressEvent) => {
				if (onEmptyLongPress) {
					onEmptyLongPress(pressEvent);
				} else {
					interaction.enterEditFromLongPress(pressEvent);
				}
			});
		},
		onpointermove: (event: PointerEvent) => {
			cancelMovedTap(event);
			interaction.notePointerMove(event);
		},
		onpointerup: (event: PointerEvent) => {
			interaction.notePointerUp(event);
			cancelMovedTap(event);
			if (emptyTap?.pointerId !== event.pointerId) return;
			emptyTap = null;
			// iOS can omit click on non-interactive grid content. Finish an empty tap
			// from its pointer sequence, but never from the long press that entered edit.
			if (
				interaction.mode === 'edit' &&
				!interaction.isClickGuarded() &&
				isEmptyTarget(event.target)
			) {
				onClickEmpty?.(event);
			}
		},
		onpointerleave: (event: PointerEvent) => {
			if (emptyTap?.pointerId === event.pointerId) emptyTap = null;
			interaction.notePointerLost(event);
		},
		onpointercancel: (event: PointerEvent) => {
			if (emptyTap?.pointerId === event.pointerId) emptyTap = null;
			interaction.notePointerCancel(event);
		},
		onclick: (event: MouseEvent) => {
			if (suppressTouchClick && event.detail !== 0) {
				suppressTouchClick = false;
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			if (interaction.consumeClickSuppression()) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			if (interaction.mode === 'dragging' || interaction.isClickGuarded()) {
				event.preventDefault();
				event.stopPropagation();
				return;
			}
			if (interaction.mode === 'view') return;
			if (!isEmptyTarget(event.target)) return;
			onClickEmpty?.(event);
		}
	};
}
