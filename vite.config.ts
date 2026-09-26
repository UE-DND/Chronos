import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite-plus';
import { createChronosAlias } from './scripts/resolve-chronos-aliases.ts';

const chronosAlias = createChronosAlias();
const appVersion = JSON.parse(
	readFileSync(
		resolve(fileURLToPath(new URL('.', import.meta.url)), 'apps/web/package.json'),
		'utf8'
	)
).version as string;

export default defineConfig({
	defaultPackage: './apps/web',
	resolve: {
		alias: [
			{ find: '$lib', replacement: fileURLToPath(new URL('./apps/web/src/lib', import.meta.url)) },
			{
				find: '$chronos-platform-adapter',
				replacement: fileURLToPath(
					new URL('./apps/web/src/lib/platform/web-platform-adapter.ts', import.meta.url)
				)
			},
			{
				find: '$app/environment',
				replacement: fileURLToPath(
					new URL(
						'./node_modules/@sveltejs/kit/src/runtime/app/environment/index.js',
						import.meta.url
					)
				)
			},
			{
				find: '$app/paths',
				replacement: fileURLToPath(
					new URL('./apps/web/src/test-mocks/app-paths.ts', import.meta.url)
				)
			},
			{
				find: 'virtual:pwa-register',
				replacement: fileURLToPath(
					new URL('./apps/web/src/test-mocks/pwa-register.ts', import.meta.url)
				)
			},
			{
				find: '$app/navigation',
				replacement: fileURLToPath(
					new URL('./apps/web/src/test-mocks/app-navigation.ts', import.meta.url)
				)
			},
			{
				find: '$app/stores',
				replacement: fileURLToPath(
					new URL('./node_modules/@sveltejs/kit/src/runtime/app/stores.js', import.meta.url)
				)
			},
			{
				find: '$app/state',
				replacement: fileURLToPath(
					new URL('./node_modules/@sveltejs/kit/src/runtime/app/state/index.js', import.meta.url)
				)
			},
			{
				find: '$env/dynamic/public',
				replacement: fileURLToPath(
					new URL('./apps/web/src/lib/config/env-dynamic-public-mock.ts', import.meta.url)
				)
			},
			{
				find: '$env/static/public',
				replacement: fileURLToPath(
					new URL('./apps/web/src/lib/config/env-dynamic-public-mock.ts', import.meta.url)
				)
			},
			...chronosAlias
		],
		dedupe: ['svelte']
	},
	define: {
		__BUILD_TIME__: JSON.stringify(new Date().toISOString()),
		__CHRONOS_PROFILE__: JSON.stringify(process.env.CHRONOS_PROFILE ?? 'chronos-default'),
		__ANALYTICS_ENABLED__: JSON.stringify(true),
		__SVELTEKIT_APP_VERSION__: JSON.stringify(appVersion),
		__SVELTEKIT_DEV__: JSON.stringify(false),
		__SVELTEKIT_PAYLOAD_URL__: JSON.stringify(''),
		__SVELTEKIT_EXPERIMENTAL_EXPLICIT_ENVIRONMENT_VARIABLES__: JSON.stringify(false)
	},
	staged: {
		// Plain .js is excluded: the only tracked .js files are the generated
		// official-plugin bundles, which must never be reformatted after the
		// build computed their manifest sha256 (see scripts/official-plugin-build/verify-official-plugins.ts).
		'*.{ts,tsx,vue,svelte,json,css,html}': 'vp check --fix'
	},
	run: {
		tasks: {
			// dev/build stay in package.json; apps/web/vercel.json configures Vercel deploy.
			preview: {
				command: 'vp -C apps/web preview',
				cache: false
			},
			'build:cqut': {
				command:
					'CHRONOS_DISTRIBUTION=cqut node --experimental-strip-types apps/web/scripts/run-host.ts build',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'ANALYZE', 'SOURCE_DATE_EPOCH']
			},
			'build:cqut-offline': {
				command:
					'CHRONOS_DISTRIBUTION=cqut-offline node --experimental-strip-types apps/web/scripts/run-host.ts build',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'ANALYZE', 'SOURCE_DATE_EPOCH']
			},
			'build:default': {
				command:
					'CHRONOS_DISTRIBUTION=default node --experimental-strip-types apps/web/scripts/run-host.ts build',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'ANALYZE', 'SOURCE_DATE_EPOCH']
			},
			'build:pages': {
				command:
					'CHRONOS_DEPLOY_TARGET=pages CHRONOS_DISTRIBUTION=pages node --experimental-strip-types apps/web/scripts/run-host.ts build && cp apps/web/build/404.html apps/web/build/index.html',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'ANALYZE', 'SOURCE_DATE_EPOCH']
			},
			'build:mobile': {
				command:
					'CHRONOS_DEPLOY_TARGET=mobile CHRONOS_DISTRIBUTION=mobile node --experimental-strip-types apps/web/scripts/run-host.ts build',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'SOURCE_DATE_EPOCH']
			},
			'mobile:build': {
				command:
					'CHRONOS_DEPLOY_TARGET=mobile CHRONOS_DISTRIBUTION=mobile node --experimental-strip-types apps/web/scripts/run-host.ts build && vp run --filter @chronos/mobile sync',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'SOURCE_DATE_EPOCH']
			},
			'mobile:sync': {
				command: 'vp run --filter @chronos/mobile sync',
				cache: false
			},
			'mobile:open:android': {
				command: 'vp run --filter @chronos/mobile open:android',
				cache: false
			},
			'bundle:analyze': {
				command:
					'ANALYZE=true CHRONOS_DISTRIBUTION=default node --experimental-strip-types apps/web/scripts/run-host.ts build',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'ANALYZE', 'SOURCE_DATE_EPOCH']
			},
			check:
				'node --experimental-strip-types apps/web/scripts/emit-profile-artifacts.ts && vp check',
			'check:watch': {
				command:
					'(cd apps/web && svelte-kit sync) && svelte-check --tsconfig ./apps/web/tsconfig.json --watch',
				cache: false
			},
			lint: 'vp fmt --check . && vp lint .',
			format: 'vp fmt .',
			test: {
				// App-engine integration tests load the published plugin catalog and bundles.
				dependsOn: ['build:official-plugins'],
				command:
					'node --experimental-strip-types scripts/emit-profile-artifacts.ts && vp test -- --run',
				cwd: 'apps/web'
			},
			'theme:generate': {
				command: 'node --experimental-strip-types scripts/generate-theme-tokens.ts',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV']
			},
			'icons:png': 'node --experimental-strip-types scripts/generate-icons.ts',
			'bench:share-link': {
				command: 'tsx scripts/share-link-compression-benchmark.ts',
				cache: false
			},
			'build:official-plugins': {
				command:
					'node --experimental-strip-types scripts/official-plugin-build/build-official-plugins.ts',
				env: ['CHRONOS_*', 'PUBLIC_*', 'VITE_*', 'NODE_ENV', 'SOURCE_DATE_EPOCH']
			},
			'fetch:holiday-cn-fallback':
				'node --experimental-strip-types scripts/fetch-holiday-cn-fallback.ts',
			'verify:official-plugins':
				'node --experimental-strip-types scripts/official-plugin-build/verify-official-plugins.ts'
		}
	},
	lint: {
		ignorePatterns: [
			'apps/web/static/official-plugins/bundles/**',
			'**/*.bundle.js',
			'dist/**',
			'.svelte-kit/',
			'apps/mobile/android/**'
		],
		options: {
			typeAware: true,
			typeCheck: true
		}
	},
	fmt: {
		useTabs: true,
		singleQuote: true,
		trailingComma: 'none',
		printWidth: 100,
		sortPackageJson: false,
		sortTailwindcss: {
			stylesheet: './apps/web/src/routes/layout.css'
		},
		svelte: {},
		ignorePatterns: [
			'package-lock.json',
			'pnpm-lock.yaml',
			'yarn.lock',
			'bun.lock',
			'bun.lockb',
			'**/static/',
			'**/.svelte-kit/',
			'**/node_modules/',
			'/drizzle/',
			'**/*.generated.ts',
			'apps/mobile/android/**'
		]
	},
	plugins: [
		svelte({
			compilerOptions: {
				runes: true
			}
		})
	],
	test: {
		expect: { requireAssertions: true },
		environment: 'node',
		include: [
			'apps/web/src/**/*.{test,spec}.{js,ts}',
			'apps/web/scripts/**/*.{test,spec}.{js,ts}',
			'apps/mobile/**/*.{test,spec}.{js,ts}',
			'packages/**/*.{test,spec}.{js,ts}',
			'scripts/**/*.{test,spec}.{js,ts}'
		],
		exclude: [
			'apps/web/src/**/*.svelte.{test,spec}.{js,ts}',
			'**/node_modules/**',
			'packages/**/node_modules/**',
			'apps/mobile/**/node_modules/**'
		],
		server: {
			deps: {
				inline: ['bits-ui']
			}
		}
	}
});
