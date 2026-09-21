import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readBuildCache, writeBuildCache, inputAffected } from './cache.ts';

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
});
