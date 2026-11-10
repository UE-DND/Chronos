import { describe, expect, it } from 'vite-plus/test';
import { resolvePluginCatalogCategory } from './plugin-tags';

describe('plugin-tags', () => {
	it('resolves tool plugins into utility or dev catalog categories', () => {
		expect(resolvePluginCatalogCategory({ type: 'tool', toolGroup: 'utility' })).toBe(
			'tool-utility'
		);
		expect(resolvePluginCatalogCategory({ type: 'tool', toolGroup: 'dev' })).toBe('tool-dev');
		expect(resolvePluginCatalogCategory({ type: 'theme' })).toBe('theme');
	});

	it('defaults tool plugins without toolGroup to utility', () => {
		expect(resolvePluginCatalogCategory({ type: 'tool' })).toBe('tool-utility');
	});
});
