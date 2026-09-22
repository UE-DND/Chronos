import { describe, expect, it } from 'vite-plus/test';
import { applyWeekDragSelection, resolveWeekDragSelectionMode } from './week-drag-selection';

describe('week drag selection', () => {
	it('selects every entered week when dragging starts on an unselected week', () => {
		const mode = resolveWeekDragSelectionMode([2], 1);
		expect(mode).toBe('select');
		expect(applyWeekDragSelection([2], 1, mode)).toEqual([2, 1]);
		expect(applyWeekDragSelection([2, 1], 3, mode)).toEqual([2, 1, 3]);
	});

	it('deselects every entered week when dragging starts on a selected week', () => {
		const mode = resolveWeekDragSelectionMode([1, 2, 3], 2);
		expect(mode).toBe('deselect');
		expect(applyWeekDragSelection([1, 2, 3], 2, mode)).toEqual([1, 3]);
		expect(applyWeekDragSelection([1, 3], 3, mode)).toEqual([1]);
	});

	it('leaves a week unchanged when it already matches the drag mode', () => {
		const selected = [1, 2];
		expect(applyWeekDragSelection(selected, 2, 'select')).toBe(selected);
		expect(applyWeekDragSelection(selected, 3, 'deselect')).toBe(selected);
	});
});
