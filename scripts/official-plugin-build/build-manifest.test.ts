import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vite-plus/test';
import { OFFICIAL_PLUGINS } from '../official-plugins.config.ts';
import { buildDevManifestForPlugin, buildManifestForPlugin } from './build-manifest.ts';

const releaseVersion = '0.0.0-test';

describe('buildManifestForPlugin', () => {
	it('includes bundle and css hashes when assets are present', () => {
		const code = 'export default { id: "tool-today", name: "今日😀" };';
		const cssCode = '.x { color: red; }';

		const manifest = buildManifestForPlugin(
			{
				id: 'tool-today',
				type: 'tool',
				toolGroup: 'utility',
				sourceDir: 'today',
				name: { 'zh-CN': '今日', en: 'Today' },
				description: { 'zh-CN': 'd', en: 'd' }
			},
			{ code, cssCode, colorsJson: null, iconThemeJson: null },
			releaseVersion
		);

		expect(manifest.downloadSizeBytes).toBe(Buffer.byteLength(code) + Buffer.byteLength(cssCode));
		expect(manifest.version).toBe(releaseVersion);
		expect(manifest.bundleUrl).toBe('/official-plugins/bundles/tool-today/bundle.js');
		expect(manifest.sha256).toBe(createHash('sha256').update(code).digest('hex'));
		expect(manifest.cssUrl).toBe('/official-plugins/bundles/tool-today/bundle.css');
		expect(manifest.cssSha256).toBe(createHash('sha256').update(cssCode).digest('hex'));
	});

	it('includes toolGroup for utility and dev tool plugins', () => {
		const utilityManifest = buildManifestForPlugin(
			{
				id: 'tool-today',
				type: 'tool',
				toolGroup: 'utility',
				sourceDir: 'today',
				name: { 'zh-CN': '今日', en: 'Today' },
				description: { 'zh-CN': 'd', en: 'd' }
			},
			{ code: 'export default {}', cssCode: null, colorsJson: null, iconThemeJson: null },
			releaseVersion
		);
		const devManifest = buildManifestForPlugin(
			{
				id: 'tool-clock',
				type: 'tool',
				toolGroup: 'dev',
				sourceDir: 'clock',
				name: { 'zh-CN': '自定义时间', en: 'Custom Date & Time' },
				description: { 'zh-CN': 'd', en: 'd' }
			},
			{ code: 'export default {}', cssCode: null, colorsJson: null, iconThemeJson: null },
			releaseVersion
		);

		expect(utilityManifest.toolGroup).toBe('utility');
		expect(devManifest.toolGroup).toBe('dev');
	});

	it('includes rev-scoped URLs for dev manifests', () => {
		const code = 'export default { id: "tool-today" };';

		const manifest = buildManifestForPlugin(
			{
				id: 'tool-today',
				type: 'tool',
				toolGroup: 'utility',
				sourceDir: 'today',
				name: { 'zh-CN': '今日', en: 'Today' },
				description: { 'zh-CN': 'd', en: 'd' }
			},
			{ code, cssCode: null, colorsJson: null, iconThemeJson: null },
			releaseVersion
		);

		expect(manifest.bundleUrl).toBe('/official-plugins/bundles/tool-today/bundle.js');

		const devManifest = buildDevManifestForPlugin(
			{
				id: 'tool-today',
				type: 'tool',
				toolGroup: 'utility',
				sourceDir: 'today',
				name: { 'zh-CN': '今日', en: 'Today' },
				description: { 'zh-CN': 'd', en: 'd' }
			},
			{ code, cssCode: null, colorsJson: null, iconThemeJson: null },
			releaseVersion,
			'abc123'
		);

		expect(devManifest.devRev).toBe('abc123');
		expect(devManifest.bundleUrl).toBe('/official-plugins/bundles/tool-today/abc123/bundle.js');
	});

	it('writes allowedDomains and capabilities from official plugin definitions into prod and dev manifests', () => {
		const emptyAssets = {
			code: 'export default {}',
			cssCode: null,
			colorsJson: null,
			iconThemeJson: null
		};
		const cqut = OFFICIAL_PLUGINS.find((entry) => entry.id === 'source-cqut')!;
		const holidays = OFFICIAL_PLUGINS.find((entry) => entry.id === 'tool-calendar-holidays')!;
		const clock = OFFICIAL_PLUGINS.find((entry) => entry.id === 'tool-clock')!;
		const today = OFFICIAL_PLUGINS.find((entry) => entry.id === 'tool-today')!;

		const cqutManifest = buildManifestForPlugin(cqut, emptyAssets, releaseVersion);
		const holidaysManifest = buildDevManifestForPlugin(
			holidays,
			emptyAssets,
			releaseVersion,
			'rev1'
		);
		const clockManifest = buildManifestForPlugin(clock, emptyAssets, releaseVersion);
		const clockDevManifest = buildDevManifestForPlugin(clock, emptyAssets, releaseVersion, 'rev1');
		const todayManifest = buildManifestForPlugin(today, emptyAssets, releaseVersion);

		expect(cqutManifest.allowedDomains).toEqual([
			'authserver.cqut.edu.cn',
			'uis.cqut.edu.cn',
			'timetable-cfc.cqut.edu.cn'
		]);
		expect(holidaysManifest.allowedDomains).toEqual([
			'fastly.jsdelivr.net',
			'raw.githubusercontent.com'
		]);
		expect(clockManifest.capabilities).toEqual(['clock']);
		expect(clockDevManifest.capabilities).toEqual(['clock']);
		expect(todayManifest.allowedDomains).toBeUndefined();
		expect(todayManifest.capabilities).toBeUndefined();
	});

	it('rejects invalid allowedDomains and capabilities when building manifests', () => {
		const emptyAssets = {
			code: 'export default {}',
			cssCode: null,
			colorsJson: null,
			iconThemeJson: null
		};
		const base = {
			id: 'tool-today',
			type: 'tool' as const,
			toolGroup: 'utility' as const,
			sourceDir: 'today',
			name: { 'zh-CN': '今日', en: 'Today' },
			description: { 'zh-CN': 'd', en: 'd' }
		};

		expect(() =>
			buildManifestForPlugin({ ...base, allowedDomains: ['edu.cn'] }, emptyAssets, releaseVersion)
		).toThrow(/invalid allowed domain/);
		expect(() =>
			buildDevManifestForPlugin(
				{ ...base, capabilities: ['admin' as never] },
				emptyAssets,
				releaseVersion,
				'rev1'
			)
		).toThrow(/invalid capability/);
	});
});
