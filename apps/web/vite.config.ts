import { preinstallPrecachePlugin } from './src/lib/profile-codegen/preinstall-precache';
import { fileURLToPath } from 'node:url';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { functionsMixins } from 'vite-plugin-functions-mixins';
import { defineConfig, lazyPlugins, loadEnv } from 'vite-plus';
import {
	resolveDeployTarget,
	getDeployTargetDefinition,
	createDeployTargetAdapter
} from './scripts/build-config/deploy-targets.ts';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { chronosBundleAnalyzer } from './src/lib/profile-codegen/chronos-bundle-analyzer.ts';
import { materialSymbolsWeightPlugin } from './src/lib/icons/material-symbols-weight-plugin.ts';
import {
	createChronosAlias,
	createChronosAliasRecord
} from '../../scripts/resolve-chronos-aliases.ts';
import { OFFICIAL_PLUGINS } from '../../scripts/official-plugins.config.ts';
import {
	readHostBuildContext,
	hostBuildContextPlugin
} from '../../scripts/official-plugin-build/host-context.ts';
import { writeGeneratedVersionJson } from './src/lib/content/releases/version-generator';
import { chronosLicensePlugin } from './src/lib/legal/chronos-license-plugin';
import { chronosProfilePlugin } from './src/lib/profile-codegen/chronos-profile-plugin';
import { resolveProfile, resolveProfileId } from './src/lib/profile-codegen/profile-definitions';
import { chronosPluginHmrPlugin } from './src/lib/dev/chronos-plugin-hmr-vite.ts';
import { PAGES_CACHE_NAME } from './src/lib/storage/cache-storage';

const webRoot = fileURLToPath(new URL('.', import.meta.url));
const monorepoRoot = fileURLToPath(new URL('../..', import.meta.url));

function chronosVersionPlugin() {
	return {
		name: 'chronos-version',
		configureServer() {
			writeGeneratedVersionJson();
		},
		buildStart() {
			writeGeneratedVersionJson();
		}
	};
}

const deployTarget = resolveDeployTarget();
const targetDef = getDeployTargetDefinition(deployTarget);
const shouldAnalyze = process.env.ANALYZE === 'true';
const basePath = targetDef.basePath;

function resolveManualChunk(id: string): string | undefined {
	if (!id.includes('node_modules')) return undefined;
	if (id.includes('dexie')) return 'vendor-dexie';
	if (id.includes('marked')) return 'vendor-marked';
	if (id.includes('posthog-js')) return 'vendor-posthog';
	return undefined;
}

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), 'PUBLIC_');
	const bootColors = readHostBuildContext();

	return {
		resolve: {
			alias: [
				...createChronosAlias(monorepoRoot),
				{
					find: '$chronos-platform-adapter',
					replacement: targetDef.isMobile
						? fileURLToPath(
								new URL('../../apps/mobile/src/mobile-platform-adapter.ts', import.meta.url)
							)
						: fileURLToPath(new URL('./src/lib/platform/web-platform-adapter.ts', import.meta.url))
				}
			],
			dedupe: ['svelte']
		},
		optimizeDeps: {
			exclude: ['@material-symbols-svg/svelte']
		},
		define: {
			__BUILD_TIME__: JSON.stringify(new Date().toISOString()),
			__CHRONOS_PROFILE__: JSON.stringify(resolveProfileId()),
			__CHRONOS_PLUGIN_MARKET_BASE_URL__: JSON.stringify(
				process.env.CHRONOS_PLUGIN_MARKET_BASE_URL ?? env.CHRONOS_PLUGIN_MARKET_BASE_URL ?? ''
			),
			__ANDROID_RELEASE_FEED_URL__: JSON.stringify(
				env.PUBLIC_ANDROID_RELEASE_FEED_URL?.trim() ?? ''
			),
			__ANALYTICS_ENABLED__: JSON.stringify(
				mode === 'test' || Boolean(env.PUBLIC_POSTHOG_KEY?.trim())
			),
			__CHRONOS_PLATFORM_TARGET__: JSON.stringify(targetDef.target)
		},
		build: {
			rolldownOptions: {
				output: {
					manualChunks(id) {
						return resolveManualChunk(id);
					}
				}
			}
		},
		server: {
			fs: {
				allow: [webRoot, monorepoRoot]
			}
		},
		staged: {
			'*': 'vp check --fix'
		},
		fmt: {
			useTabs: true,
			singleQuote: true,
			trailingComma: 'none',
			printWidth: 100,
			sortPackageJson: false,
			sortTailwindcss: {
				stylesheet: './src/routes/layout.css'
			},
			svelte: {},
			ignorePatterns: [
				'package-lock.json',
				'pnpm-lock.yaml',
				'yarn.lock',
				'bun.lock',
				'bun.lockb',
				'static/',
				'.svelte-kit/',
				'**/*.generated.ts'
			]
		},
		plugins: lazyPlugins(() => [
			hostBuildContextPlugin(monorepoRoot),
			chronosBundleAnalyzer(shouldAnalyze),
			chronosLicensePlugin(webRoot),
			materialSymbolsWeightPlugin(),
			chronosProfilePlugin(webRoot),
			preinstallPrecachePlugin(webRoot, resolveProfile(resolveProfileId()), basePath),
			chronosVersionPlugin(),

			chronosPluginHmrPlugin({
				monorepoRoot,
				plugins: OFFICIAL_PLUGINS,
				createAliasRecord: createChronosAliasRecord
			}),
			functionsMixins(),
			tailwindcss(),
			sveltekit({
				// alias 统一由顶层 resolve.alias 提供，此处不再重复声明
				compilerOptions: {
					runes: ({ filename }) =>
						filename.split(/[/\\]/).includes('node_modules') ? undefined : true
				},
				paths: {
					base: basePath
				},
				adapter: createDeployTargetAdapter(targetDef)
			}),
			SvelteKitPWA({
				disable: targetDef.disablePwa,
				registerType: 'prompt',
				manifest: {
					name: 'Chronos',
					short_name: 'Chronos',
					description: '课程表应用',
					...(bootColors
						? { theme_color: bootColors.themeColor, background_color: bootColors.backgroundColor }
						: {}),
					display: 'standalone',
					display_override: ['standalone', 'minimal-ui'],
					start_url: `${basePath}/`,
					id: `${basePath}/`,
					scope: basePath ? `${basePath}/` : '/',
					launch_handler: {
						client_mode: 'auto'
					},
					icons: [
						{
							src: `${basePath}/pwa-192.png`,
							sizes: '192x192',
							type: 'image/png',
							purpose: 'any'
						},
						{
							src: `${basePath}/pwa-512.png`,
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any'
						},
						{
							src: `${basePath}/pwa-192-maskable.png`,
							sizes: '192x192',
							type: 'image/png',
							purpose: 'maskable'
						},
						{
							src: `${basePath}/pwa-512-maskable.png`,
							sizes: '512x512',
							type: 'image/png',
							purpose: 'maskable'
						}
					],
					screenshots: [
						{
							src: `${basePath}/pwa/screenshot-narrow.png`,
							sizes: '1080x1920',
							type: 'image/png',
							form_factor: 'narrow',
							label: 'Chronos'
						},
						{
							src: `${basePath}/pwa/screenshot-wide.png`,
							sizes: '1920x1080',
							type: 'image/png',
							form_factor: 'wide',
							label: 'Chronos'
						}
					]
				},
				workbox: {
					clientsClaim: true,
					// Drop stale navigation HTML whenever this SW becomes active
					// (skipWaiting or last client closed), not only on the in-app install path.
					importScripts: ['sw-pages-cache-cleanup.js'],
					globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}'],
					globIgnores: ['**/official-plugins/**', '**/plugins/releases/**'],
					navigateFallback: null,
					runtimeCaching: [
						{
							// SvelteKit emits this bootstrap module after SW generation. Keep it
							// with the navigation document; SW activate and install clear pages-cache.
							urlPattern: /\/_app\/env\.js$/,
							handler: 'CacheFirst',
							options: {
								cacheName: PAGES_CACHE_NAME,
								expiration: { maxEntries: 32, maxAgeSeconds: 2_592_000 }
							}
						},
						{
							// ADR 0035: document must match the controlling SW.
							urlPattern: ({ request }: { request: Request }) => request.mode === 'navigate',
							handler: 'CacheFirst',
							options: {
								cacheName: PAGES_CACHE_NAME,
								expiration: { maxEntries: 32, maxAgeSeconds: 2_592_000 }
							}
						},
						{
							urlPattern: /\/version\.json$/i,
							handler: 'NetworkOnly'
						},
						{
							urlPattern: /\/legal\/.*\.md$|\/licenses\/.*$/i,
							handler: 'CacheFirst',
							options: {
								cacheName: 'static-legal-licenses',
								expiration: { maxEntries: 16, maxAgeSeconds: 2_592_000 }
							}
						},
						{
							urlPattern: /\/manifest\.webmanifest$/i,
							handler: 'NetworkFirst',
							options: {
								cacheName: 'pwa-manifest',
								networkTimeoutSeconds: 5,
								expiration: { maxEntries: 1, maxAgeSeconds: 86_400 }
							}
						}
					]
				},
				devOptions: { enabled: false }
			}),
			paraglideVitePlugin({
				project: './project.inlang',
				outdir: './src/lib/paraglide',
				emitTsDeclarations: true
			})
		]),
		test: {
			expect: { requireAssertions: true },
			environment: 'node',
			setupFiles: ['src/test-setup.ts'],
			include: [
				'src/**/*.{test,spec}.{js,ts}',
				'scripts/**/*.{test,spec}.{js,ts}',
				'../../packages/**/*.{test,spec}.{js,ts}',
				'../../scripts/**/*.{test,spec}.{js,ts}'
			],
			exclude: [
				'src/**/*.svelte.{test,spec}.{js,ts}',
				'**/node_modules/**',
				'../../packages/**/node_modules/**'
			]
		}
	};
});
