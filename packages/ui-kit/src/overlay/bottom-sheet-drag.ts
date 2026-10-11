import { projectMomentum } from '../motion/gesture-motion';

export const DISMISS_THRESHOLD_RATIO = 0.25;
export const DISMISS_FALLBACK_THRESHOLD_PX = 80;

export function clampDragOffset(deltaY: number): number {
	return Math.max(0, deltaY);
}

export function shouldDismissSheet(
	offsetPx: number,
	sheetHeightPx: number,
	ratio = DISMISS_THRESHOLD_RATIO,
	velocity = 0
): boolean {
	if (velocity <= -0.1) return false;
	const projected = offsetPx + (velocity > 0 ? projectMomentum(velocity) : 0);
	if (sheetHeightPx <= 0) {
		return projected >= DISMISS_FALLBACK_THRESHOLD_PX;
	}
	return projected >= sheetHeightPx * ratio;
}

export function overlayOpacityFromDrag(offsetPx: number, sheetHeightPx: number): number {
	if (sheetHeightPx <= 0) return 1;
	return Math.max(0, 1 - offsetPx / sheetHeightPx);
}

export function needsSnapBackAnimation(offsetPx: number): boolean {
	return offsetPx > 0;
}
