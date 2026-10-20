import { en } from './en';
import { zhCn } from './zh-cn';

export const HOST_MESSAGES = { 'zh-cn': zhCn, en } as const;

export const HOST_UI_PLUGIN_ID = 'host-ui';

export type HostMessageKey = keyof typeof zhCn;

export const CORE_SHELL_MESSAGE_KEYS = [
	'wallpaper.item',
	'tab.timetable',
	'tab.mine',
	'section.data-sync',
	'section.appearance-feedback',
	'section.app-support',
	'item.manage-timetables',
	'item.import',
	'item.export',
	'item.display',
	'item.feedback',
	'item.plugins',
	'item.install',
	'item.install.supporting.standalone',
	'item.install.supporting.local',
	'item.install.supporting.prompt',
	'item.about',
	'plugin.name',
	'plugin.description'
] as const satisfies ReadonlyArray<HostMessageKey>;

export { en, zhCn };
