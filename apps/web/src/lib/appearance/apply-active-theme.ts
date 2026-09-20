import type { ChronosEngine } from '@chronos/core';
import { resolveThemeWorkbenchColors } from '@chronos/core';
import { applyWorkbenchColors } from '@chronos/core';

let previouslyAppliedThemeClass: string | null = null;
let previouslyAppliedCustomVarKeys: string[] = [];

function clearCustomThemeStyles(target: HTMLElement) {
	for (const key of previouslyAppliedCustomVarKeys) {
		target.style.removeProperty(key);
	}
	previouslyAppliedCustomVarKeys = [];

	if (previouslyAppliedThemeClass) {
		target.classList.remove(previouslyAppliedThemeClass);
		previouslyAppliedThemeClass = null;
	}

	for (const prop of Array.from(target.style)) {
		if (
			prop.startsWith('--color-') ||
			prop.startsWith('--period-') ||
			prop.startsWith('--leading-') ||
			prop.startsWith('--shell-')
		) {
			target.style.removeProperty(prop);
		}
	}
}

export function applyActiveTheme(
	engine: ChronosEngine,
	activeThemeId: string | null,
	isDark: boolean,
	options?: { target?: HTMLElement }
): void {
	const el =
		options?.target ?? (typeof document !== 'undefined' ? document.documentElement : undefined);
	if (!el) return;

	const theme = engine.themes.getTheme(activeThemeId);
	// Keep the last rendered colors while an active theme is being replaced.
	// An explicit null selection still clears the theme.
	if (activeThemeId && !theme) return;

	clearCustomThemeStyles(el);
	el.classList.toggle('chronos-theme-active', Boolean(theme));

	if (!theme) {
		return;
	}

	if (theme.className) {
		el.classList.add(theme.className);
		previouslyAppliedThemeClass = theme.className;
	}

	const mode = isDark ? 'dark' : 'light';
	const workbenchColors = resolveThemeWorkbenchColors(theme, mode);
	previouslyAppliedCustomVarKeys = applyWorkbenchColors(el, workbenchColors);
}
