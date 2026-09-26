import { isWorkbenchColorKey, WORKBENCH_COLOR_REGISTRY } from '@chronos/core';

export function applyWorkbenchColors(
	target: HTMLElement,
	colors: Record<string, string>
): string[] {
	const appliedKeys: string[] = [];
	for (const [key, value] of Object.entries(colors)) {
		if (!isWorkbenchColorKey(key)) continue;
		const def = WORKBENCH_COLOR_REGISTRY[key];
		target.style.setProperty(def.cssVar, value);
		appliedKeys.push(def.cssVar);
	}
	return appliedKeys;
}
