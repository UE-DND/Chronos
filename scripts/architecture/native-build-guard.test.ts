import { describe, expect, it } from 'vite-plus/test';
import { assertWebModuleGraph } from './native-build-guard';

describe('pure Web resolved dependency graph', () => {
	it('rejects native modules reached through nested and pnpm dependencies', () => {
		for (const path of [
			'/app/node_modules/@capacitor/core/dist/index.js',
			'/app/node_modules/.pnpm/@capacitor+http@1.0/node_modules/@capacitor/http/index.js'
		]) {
			expect(() => assertWebModuleGraph(['/app/entry.js', path])).toThrow(path);
		}
	});
	it('allows Web modules and non-native package names', () => {
		expect(() =>
			assertWebModuleGraph(['/app/src/main.ts', '/app/node_modules/capacitor-docs/index.js'])
		).not.toThrow();
	});
});
