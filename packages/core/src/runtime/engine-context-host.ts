import type { ChronosActions } from '../types/actions';
import type { ChronosState } from '../types/state';
import type { ChronosEnv } from '../types/env';
import type { EventPipeline } from './event-pipeline';
import type { HierarchicalSlotRegistry } from './hierarchical-slot-registry';
import type { ThemeRegistry } from './theme-registry';
import type { IconThemeRegistry } from './icon-theme-registry';
import type { BadgeManager } from './badge-manager';
import type { I18nCatalog } from '../i18n/i18n-catalog';

/** Host surface exposed to plugin ScopedContext instances. */
export interface EngineContextHost {
	readonly events: EventPipeline;
	readonly slots: HierarchicalSlotRegistry;
	readonly themes?: ThemeRegistry;
	readonly iconThemes?: IconThemeRegistry;
	readonly badges?: BadgeManager;
	readonly env: ChronosEnv;
	readonly i18nCatalog: I18nCatalog;
	readonly locale: string;
	translateForPlugin(pluginId: string, key: string, params?: Record<string, unknown>): string;
	readonly state: ChronosState;
	readonly actions: ChronosActions;
}
