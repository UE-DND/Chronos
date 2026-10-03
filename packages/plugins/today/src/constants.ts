export const TODAY_PLUGIN_ID = 'tool-today';

export type TodayScope = 'active' | 'all';

export interface TodayPluginConfig {
	scope: TodayScope;
}
