import type { Disposable } from '../types/env';
import type { ThemeContribution } from '../types/contributions';
import type { HierarchicalSlotRegistry } from './hierarchical-slot-registry';

export class ThemeRegistry implements Disposable {
	constructor(
		private slots: HierarchicalSlotRegistry,
		private onThemesChanged?: () => void
	) {}

	registerTheme(theme: ThemeContribution, ownerPluginId?: string): Disposable {
		const handle = this.slots.register('theme.definition', theme, ownerPluginId);
		this.onThemesChanged?.();
		return {
			dispose: () => {
				handle.dispose();
				this.onThemesChanged?.();
			}
		};
	}

	getTheme(id: string | null): ThemeContribution | undefined {
		return (id ? this.slots.getSlotItem('theme.definition', id) : undefined) as
			| ThemeContribution
			| undefined;
	}

	getThemes(): ReadonlyArray<ThemeContribution> {
		return this.slots.get('theme.definition') as ReadonlyArray<ThemeContribution>;
	}

	isSelectable(id: string | null): boolean {
		const theme = this.getTheme(id);
		return !!theme && !(typeof theme.disabled === 'function' ? theme.disabled() : theme.disabled);
	}

	dispose(): void {
		// slots lifecycle is managed by the host
	}
}
