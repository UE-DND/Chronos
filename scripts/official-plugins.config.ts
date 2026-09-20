import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

type OfficialPluginBase = {
	id: string;
	name: Record<string, string>;
	description: Record<string, string>;
	/** packages/plugins source directory */
	sourceDir: string;
	entry?: string;
	prepareResources?: string;
	colorsJson?: string;
	iconsJson?: string;
	/** JSON-only assets skip self-contained bundle.css verification (default: has entry) */
	tailwindSource?: boolean;
};

export type OfficialPluginDef =
	| (OfficialPluginBase & { type: 'theme' | 'source' | 'codec' })
	| (OfficialPluginBase & { type: 'tool'; toolGroup: 'utility' | 'dev' });

export const OFFICIAL_PLUGINS: OfficialPluginDef[] = [
	{
		id: 'codec-share',
		type: 'tool',
		toolGroup: 'utility',
		sourceDir: 'codec-share',
		name: { 'zh-CN': '分享口令', en: 'Share token' },
		description: {
			'zh-CN': '通过分享口令导入和分享课表',
			en: 'Import and share timetables with share tokens'
		},
		entry: resolve(root, 'packages/plugins/codec-share/bundle/entry.ts')
	},
	{
		id: 'source-cqut',
		type: 'source',
		sourceDir: 'source-cqut',
		name: { 'zh-CN': '重庆理工大学', en: 'CQUT' },
		description: {
			'zh-CN': '导入 HTML 课表；在线同步需要部署教务代理',
			en: 'Import HTML timetables; online sync requires the deployed CQUT proxy'
		},
		entry: resolve(root, 'packages/plugins/source-cqut/bundle/entry.ts')
	},
	{
		id: 'theme-m3',
		type: 'theme',
		sourceDir: 'theme-m3',
		prepareResources: resolve(root, 'packages/plugins/theme-m3/build.ts'),
		entry: resolve(root, 'packages/plugins/theme-m3/src/index.ts'),
		tailwindSource: false,
		name: { 'zh-CN': 'Material 3', en: 'Material 3' },
		description: {
			'zh-CN': 'Chronos 默认 Material 3 配色',
			en: 'Chronos default Material 3 colors'
		},
		colorsJson: resolve(root, 'packages/plugins/theme-m3/theme-m3.colors.json')
	},
	{
		id: 'theme-yumemita',
		type: 'theme',
		sourceDir: 'theme-yumemita',
		tailwindSource: false,
		name: { 'zh-CN': 'YUMEMITA', en: 'YUMEMITA' },
		description: { 'zh-CN': 'YUMEMITA 主题', en: 'YUMEMITA theme' },
		colorsJson: resolve(root, 'packages/plugins/theme-yumemita/theme-yumemita.colors.json'),
		iconsJson: resolve(root, 'packages/plugins/theme-yumemita/theme-yumemita.icons.json')
	},
	{
		id: 'tool-qrcode',
		type: 'tool',
		toolGroup: 'utility',
		sourceDir: 'codec-qrcode',
		name: { 'zh-CN': '二维码', en: 'QR Code' },
		description: {
			'zh-CN': '通过二维码导入/导出课表',
			en: 'Import and export timetables via QR codes'
		},
		entry: resolve(root, 'packages/plugins/codec-qrcode/bundle/entry.ts')
	},
	{
		id: 'tool-calendar-holidays',
		type: 'tool',
		toolGroup: 'utility',
		sourceDir: 'calendar-holidays',
		name: { 'zh-CN': '法定节假日', en: 'Public Holidays' },
		description: {
			'zh-CN': '在课表中展示法定节假日',
			en: 'Show public holidays on the timetable'
		},
		entry: resolve(root, 'packages/plugins/calendar-holidays/bundle/entry.ts')
	},
	{
		id: 'tool-today',
		type: 'tool',
		toolGroup: 'utility',
		sourceDir: 'today',
		name: { 'zh-CN': '今日', en: 'Today' },
		description: {
			'zh-CN': '快速查看当天课程',
			en: "Quickly view today's courses"
		},
		entry: resolve(root, 'packages/plugins/today/bundle/entry.ts')
	},
	{
		id: 'tool-error-log',
		type: 'tool',
		toolGroup: 'dev',
		sourceDir: 'error-log',
		name: { 'zh-CN': '错误日志', en: 'Error Log' },
		description: {},
		entry: resolve(root, 'packages/plugins/error-log/bundle/entry.ts')
	},
	{
		id: 'tool-clock',
		type: 'tool',
		toolGroup: 'dev',
		sourceDir: 'clock',
		name: { 'zh-CN': '自定义时间', en: 'Custom Date & Time' },
		description: {},
		entry: resolve(root, 'packages/plugins/clock/bundle/entry.ts')
	}
];
