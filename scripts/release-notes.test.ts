import { describe, expect, it } from 'vite-plus/test';
import { assertReleaseContent } from '../apps/web/src/lib/content/releases/release';
import { previousReleaseTag } from './release-notes';

describe('previous release selection', () => {
	it('uses stable releases below the target version', () => {
		expect(
			previousReleaseTag(['v1.0.0', 'v1.2.0', 'v2.0.0', 'v1.3.0-beta.1', 'garbage'], 'v1.3.0')
		).toBe('v1.2.0');
	});
});

describe('release content gate', () => {
	const entry = {
		tagName: 'v1.2.10',
		name: 'Chronos 1.2.10',
		publishedAt: '2026-10-15',
		body: '## 修复\n\n- Android：修复课程显示。'
	};
	it.each([
		{ body: '' },
		{ body: '## 新增\n\n<!-- 写在这里 -->' },
		{ body: '## 优化\n\n- TODO' },
		{ body: '待补充' },
		{ name: 'Chronos 1.2.9' },
		{ publishedAt: '2026-02-30' },
		{ publishedAt: '2026-2-3' },
		{ tagName: 'v1.2.10-beta' }
	])('rejects incomplete current release metadata: %j', (change) => {
		expect(() => assertReleaseContent({ ...entry, ...change })).toThrow();
	});
	it('allows reviewed prose, links, and a real leap date', () => {
		expect(() =>
			assertReleaseContent({
				...entry,
				publishedAt: '2028-02-29',
				body: entry.body + '\n\n[#42](https://github.com/UE-DND/Chronos/pull/42)'
			})
		).not.toThrow();
	});
});
