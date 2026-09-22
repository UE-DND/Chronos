export type WeekDragSelectionMode = 'select' | 'deselect';

export function resolveWeekDragSelectionMode(
	selectedWeeks: readonly number[],
	startWeek: number
): WeekDragSelectionMode {
	return selectedWeeks.includes(startWeek) ? 'deselect' : 'select';
}

export function applyWeekDragSelection(
	selectedWeeks: number[],
	week: number,
	mode: WeekDragSelectionMode
): number[] {
	const selected = selectedWeeks.includes(week);
	if ((mode === 'select' && selected) || (mode === 'deselect' && !selected)) {
		return selectedWeeks;
	}
	return mode === 'select'
		? [...selectedWeeks, week]
		: selectedWeeks.filter((entry) => entry !== week);
}
