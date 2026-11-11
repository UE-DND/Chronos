import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
	digest,
	inputAffected,
	readBuildCache,
	rememberLoadedFile,
	writeBuildCache
} from './cache.ts';

const roots: string[] = [];
afterEach(() => roots.splice(0).forEach((root) => rmSync(root, { recursive: true, force: true })));
function fixture() {
	const root = mkdtempSync(join(tmpdir(), 'chronos-cache-'));
	roots.push(root);
	const source = join(root, 'src');
	mkdirSync(source);
	const entry = join(source, 'entry.ts');
	writeFileSync(entry, 'export const value = 1');
	return { root, source, entry, cache: join(root, 'cache.json') };
}
describe('plugin build cache', () => {
	it.each([
		['empty input', '', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
		['UTF-8 text', '课表😀', '1f42637df7cc2bd38df786c6222b96e98c9314cd2a67f0b861dc69287da1f5e9'],
		[
			'binary view with an offset',
			new Uint8Array([42, 0, 255, 128, 43]).subarray(1, 4),
			'f742b965f156c10374bc23aea96e3a8aff8facd6fc079defeaa30219ad86f211'
		]
	] as const)('preserves the SHA-256 digest for %s', (_name, input, expected) => {
		expect(digest(input)).toBe(expected);
	});
	it('reuses unchanged inputs and rejects changed, missing or corrupted data', () => {
		const { entry, cache } = fixture();
		writeBuildCache(cache, 'key', [entry], [], [], { code: 'output' });
		expect(readBuildCache<{ code: string }>(cache, 'key')?.value.code).toBe('output');
		expect(readBuildCache(cache, 'different')).toBeNull();
		const original = readFileSync(cache, 'utf8');
		writeFileSync(cache, original.replace('output', 'broken'));
		expect(readBuildCache(cache, 'key')).toBeNull();
		writeFileSync(cache, original);
		writeFileSync(entry, 'changed');
		expect(readBuildCache(cache, 'key')).toBeNull();
		rmSync(entry);
		expect(readBuildCache(cache, 'key')).toBeNull();
	});
	it('tracks resolution candidates and CSS scan content without reacting to documentation', () => {
		const { source, entry, cache } = fixture();
		const record = writeBuildCache(cache, 'key', [entry], [source], [source], 'output');
		writeFileSync(join(source, 'README.md'), 'docs');
		expect(readBuildCache(cache, 'key')?.value).toBe('output');
		expect(inputAffected(record.inputs, join(source, 'README.md'))).toBe(false);
		const component = join(source, 'New.svelte');
		writeFileSync(component, '<p class="new"/>');
		expect(readBuildCache(cache, 'key')).toBeNull();
		expect(inputAffected(record.inputs, component)).toBe(true);
	});
	it('pins the digest from when a file was loaded, so a later edit misses the cache', () => {
		const { entry, cache } = fixture();
		const loaded = new Map<string, string>();
		rememberLoadedFile(loaded, entry);
		writeFileSync(entry, 'export const value = 2');
		writeBuildCache(cache, 'key', [entry], [], [], { code: 'stale' }, loaded);
		expect(readBuildCache(cache, 'key')).toBeNull();
		expect(digest(readFileSync(entry))).not.toBe([...loaded.values()][0]);
	});
});
