import { afterEach, describe, expect, it } from 'vite-plus/test';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { checkBoundaries } from './check-boundaries';

const roots: string[] = [];
function project(files: Record<string, string>) {
	const root = mkdtempSync(join(tmpdir(), 'chronos-boundaries-'));
	roots.push(root);
	for (const [path, content] of Object.entries(files)) {
		mkdirSync(dirname(join(root, path)), { recursive: true });
		writeFileSync(join(root, path), content);
	}
	return root;
}
afterEach(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })));

describe('workspace boundaries', () => {
	it('rejects package, relative, dynamic and Svelte imports across layers', () => {
		const root = project({
			'packages/core/package.json': '{"name":"@chronos/core","dependencies":{"svelte":"*"}}',
			'packages/core/src/main.ts': 'export { x } from "../../ui-kit/src/main";',
			'packages/ui-kit/package.json': '{"name":"@chronos/ui-kit"}',
			'packages/ui-kit/src/main.ts': 'export const x = 1;',
			'packages/plugins/a/package.json': '{"name":"@chronos/plugin-a"}',
			'packages/plugins/b/package.json': '{"name":"@chronos/plugin-b"}',
			'packages/plugins/a/src/main.ts': 'const x = import("@chronos/plugin-b");',
			'packages/plugins/a/src/View.svelte':
				'<script lang="ts">import x from "#lib/private.ts";</script><p>test</p>'
		});
		expect(checkBoundaries(root).map((error) => error.source)).toEqual(
			expect.arrayContaining([
				'packages/core/package.json',
				'packages/core/src/main.ts',
				'packages/plugins/a/src/main.ts',
				'packages/plugins/a/src/View.svelte'
			])
		);
	});
	it('allows contracts, DOM type declarations, comments and local identifiers', () => {
		const root = project({
			'packages/core/package.json': '{"name":"@chronos/core"}',
			'packages/core/src/main.ts':
				'export {}; type Mount = (target: HTMLElement) => void; const window = 1; console.log(window); // import "svelte"',
			'packages/ui-kit/package.json':
				'{"name":"@chronos/ui-kit","dependencies":{"@chronos/core":"workspace:*"}}',
			'packages/ui-kit/src/main.ts': 'import type { Mount } from "@chronos/core";'
		});
		expect(checkBoundaries(root)).toEqual([]);
	});
	it('rejects runtime DOM globals and DOM style writes in core', () => {
		const root = project({
			'packages/core/package.json': '{"name":"@chronos/core"}',
			'packages/core/src/main.ts':
				'export function apply(target: HTMLElement) { target.style.setProperty("--x", "1"); target.appendChild(target); target["style"].setProperty("--y", "2"); return typeof window; }'
		});
		expect(checkBoundaries(root).map((error) => error.target)).toEqual(
			expect.arrayContaining(['window', 'style', 'appendChild'])
		);
	});
	it('rejects host runtime plugin imports and limits generated registries to their declared entry', () => {
		const root = project({
			'apps/web/package.json':
				'{"name":"@chronos/web","dependencies":{"@chronos/plugin-a":"workspace:*"}}',
			'apps/mobile/package.json': '{"name":"@chronos/mobile"}',
			'packages/plugins/a/package.json': '{"name":"@chronos/plugin-a"}',
			'apps/web/src/runtime.ts': 'import "@chronos/plugin-a";',
			'apps/mobile/src/runtime.ts': 'import "../../../packages/plugins/a/src/main";',
			'apps/web/src/lib/server/plugin-server-loader.generated.ts':
				'import "@chronos/plugin-a/server"; import "@chronos/plugin-a/mobile";',
			'apps/web/src/lib/boot/mobile-plugin-server-registry.generated.ts':
				'import "@chronos/plugin-a/mobile"; import "@chronos/plugin-a"; import "../../../../mobile/src/http/mobile-plugin-server-registry";',
			'apps/web/scripts/assemble.ts': 'import "@chronos/plugin-a/server/definition";',
			'apps/web/src/runtime.test.ts': 'import "@chronos/plugin-a";'
		});
		expect(checkBoundaries(root).map(({ source, target }) => [source, target])).toEqual([
			['apps/web/src/lib/boot/mobile-plugin-server-registry.generated.ts', '@chronos/plugin-a'],
			['apps/web/src/lib/server/plugin-server-loader.generated.ts', '@chronos/plugin-a/mobile'],
			['apps/web/src/runtime.ts', '@chronos/plugin-a'],
			['apps/mobile/src/runtime.ts', '../../../packages/plugins/a/src/main']
		]);
	});

	it('resolves platform aliases separately for Web and Mobile', () => {
		const root = project({
			'apps/web/package.json': '{"name":"@chronos/web"}',
			'apps/mobile/package.json': '{"name":"@chronos/mobile"}',
			'apps/web/src/main.ts': 'import "$chronos-platform-adapter";',
			'apps/web/src/lib/platform/web-platform-adapter.ts': 'export {};',
			'apps/mobile/src/mobile-platform-adapter.ts': 'import "@capacitor/core";'
		});
		expect(checkBoundaries(root, 'web')).toEqual([]);
		expect(checkBoundaries(root, 'mobile')).toEqual([]);
		writeFileSync(
			join(root, 'apps/web/src/main.ts'),
			'import "../../mobile/src/mobile-platform-adapter";'
		);
		expect(checkBoundaries(root, 'web')).toHaveLength(1);
	});
});
