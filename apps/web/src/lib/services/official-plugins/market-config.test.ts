import { expect, it } from 'vite-plus/test';
import {
	assertOfficialManifestVersion,
	isOfficialCatalogManifestUrl,
	officialCatalogUrl,
	resolvePluginMarketBase
} from './market-config';
it('pins production to a host release and retains the local development catalog', () => {
	expect(officialCatalogUrl('1.2.3', false)).toBe(
		'https://ue-dnd.github.io/Chronos/plugins/releases/1.2.3/catalog.json'
	);
	expect(officialCatalogUrl('1.2.3', true)).toBe('/official-plugins/catalog.json');
	expect(resolvePluginMarketBase('https://example.com/plugins')).toBe(
		'https://example.com/plugins/'
	);
	expect(() => resolvePluginMarketBase('http://example.com/plugins')).toThrow('HTTPS');
	expect(() => resolvePluginMarketBase('https://example.com/plugins?token=x')).toThrow('HTTPS');
});
it('checks origin, namespace boundaries, identity and the requested host version', () => {
	const url =
		'https://ue-dnd.github.io/Chronos/plugins/releases/1.2.3/manifests/revision/tool-today.manifest.json';
	expect(isOfficialCatalogManifestUrl(url, 'tool-today')).toBe(true);
	expect(isOfficialCatalogManifestUrl(url, 'tool-clock')).toBe(false);
	expect(isOfficialCatalogManifestUrl(url.replace('ue-dnd.github.io', 'evil.example'))).toBe(false);
	expect(isOfficialCatalogManifestUrl(url.replace('releases/', 'releases-other/'))).toBe(false);
	expect(isOfficialCatalogManifestUrl(url + '?other=1')).toBe(false);
	expect(() =>
		assertOfficialManifestVersion({ id: 'tool-today', version: '1.2.4' }, url, '1.2.3')
	).toThrow('version');
	expect(() =>
		assertOfficialManifestVersion({ id: 'tool-today', version: '1.2.3' }, url, '1.2.4')
	).toThrow('version');
	expect(() =>
		assertOfficialManifestVersion({ id: 'tool-clock', version: '1.2.3' }, url, '1.2.3')
	).toThrow('ID');
	expect(() =>
		assertOfficialManifestVersion(
			{ id: 'tool-today', version: '1.2.4' },
			url.replace('ue-dnd', 'UE-DND'),
			'1.2.3'
		)
	).toThrow('version');
});
