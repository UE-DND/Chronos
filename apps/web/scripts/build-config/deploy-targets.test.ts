import { describe, expect, it } from 'vite-plus/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	resolveDeployTarget,
	getDeployTargetDefinition,
	createDeployTargetAdapter,
	DEPLOY_TARGET_DEFINITIONS
} from './deploy-targets.ts';
import { resolveDeployment } from '../../src/lib/profile-codegen/deployment-definitions.ts';
import { getBootPlatformAdapter } from '../../src/lib/platform/web-platform-adapter.ts';

const webPackageJsonPath = resolve(
	fileURLToPath(new URL('.', import.meta.url)),
	'../../package.json'
);

describe('deploy-targets configuration & isolation', () => {
	it('resolves deploy target from environment with vercel default', () => {
		expect(resolveDeployTarget({})).toBe('vercel');
		expect(resolveDeployTarget({ CHRONOS_DEPLOY_TARGET: '' })).toBe('vercel');
		expect(resolveDeployTarget({ CHRONOS_DEPLOY_TARGET: 'vercel' })).toBe('vercel');
		expect(resolveDeployTarget({ CHRONOS_DEPLOY_TARGET: 'pages' })).toBe('pages');
		expect(resolveDeployTarget({ CHRONOS_DEPLOY_TARGET: 'mobile' })).toBe('mobile');
	});

	it('throws clear descriptive error on unknown deploy target', () => {
		expect(() => resolveDeployTarget({ CHRONOS_DEPLOY_TARGET: 'unknown' })).toThrow(
			'Unknown deploy target: "unknown". Supported targets are: vercel, pages, mobile.'
		);
		expect(() => resolveDeployTarget('electron')).toThrow(
			'Unknown deploy target: "electron". Supported targets are: vercel, pages, mobile.'
		);
	});

	it('returns correct centralized definitions for all targets', () => {
		const mobile = getDeployTargetDefinition('mobile');
		expect(mobile).toEqual({
			target: 'mobile',
			basePath: '',
			isMobile: true,
			disablePwa: true,
			defaultDeployment: 'mobile',
			defaultProfile: 'chronos-default',
			adapterKind: 'static-spa',
			supportsServerPlugins: false
		});

		const pages = getDeployTargetDefinition('pages');
		expect(pages).toEqual({
			target: 'pages',
			basePath: '/Chronos',
			isMobile: false,
			disablePwa: false,
			defaultDeployment: 'pages',
			defaultProfile: 'chronos-default',
			adapterKind: 'static-pages',
			supportsServerPlugins: false
		});

		const vercel = getDeployTargetDefinition('vercel');
		expect(vercel).toEqual({
			target: 'vercel',
			basePath: '',
			isMobile: false,
			disablePwa: false,
			defaultDeployment: 'chronos-default',
			defaultProfile: 'chronos-default',
			adapterKind: 'vercel',
			supportsServerPlugins: true
		});
	});

	it('creates correct adapters from definitions', () => {
		const mobileAdapter = createDeployTargetAdapter(DEPLOY_TARGET_DEFINITIONS.mobile);
		expect(mobileAdapter.name).toBe('@sveltejs/adapter-static');

		const pagesAdapter = createDeployTargetAdapter(DEPLOY_TARGET_DEFINITIONS.pages);
		expect(pagesAdapter.name).toBe('@sveltejs/adapter-static');

		const vercelAdapter = createDeployTargetAdapter(DEPLOY_TARGET_DEFINITIONS.vercel);
		expect(vercelAdapter.name).toBe('@sveltejs/adapter-vercel');
	});

	it('derives default deployment from deploy target without manual ternary', () => {
		expect(resolveDeployment({ CHRONOS_DEPLOY_TARGET: 'mobile' })).toEqual({
			serverPlugins: []
		});
		expect(resolveDeployment({ CHRONOS_DEPLOY_TARGET: 'pages' })).toEqual({
			serverPlugins: []
		});
		expect(resolveDeployment({ CHRONOS_DEPLOY_TARGET: 'vercel' })).toEqual({
			serverPlugins: []
		});
	});

	it('guarantees apps/web has zero @capacitor/* dependencies in package.json', () => {
		const pkg = JSON.parse(readFileSync(webPackageJsonPath, 'utf8'));
		const allDeps = {
			...pkg.dependencies,
			...pkg.devDependencies,
			...pkg.optionalDependencies
		};

		const capacitorDeps = Object.keys(allDeps).filter(
			(dep) => dep.startsWith('@capacitor/') || dep === '@chronos/platform-capacitor'
		);

		expect(capacitorDeps).toEqual([]);
	});

	it('provides pure web adapter with platformType web without loading Capacitor', () => {
		const adapter = getBootPlatformAdapter();
		expect(adapter.id).toBe('web');
		expect(adapter.isNative).toBe(false);
		expect(adapter.platformType).toBe('web');
		expect(adapter.supportsPwaInstall).toBe(true);
		expect(adapter.shouldShowInstallGuide).toBe(true);
	});
});
