import type { Plugin } from 'vite';

export const CLOUDFLARE_SERVER_CONDITIONS = ['workerd', 'module', 'development|production'];

export function assertCloudflareModuleGraph(ids: Iterable<string>): void {
	const unsupported = [...ids].filter((id) => {
		const path = id.replaceAll('\\', '/');
		return (
			/(?:^|[/+])undici(?:[/@+]|$)/.test(path) ||
			/^node:dns(?:\/|$)/.test(path) ||
			/\/source-cqut\/server\/(?:dispatcher|node-cqut-session)\.[jt]s(?:\?|$)/.test(path)
		);
	});
	if (unsupported.length)
		throw new Error(
			`Cloudflare build includes Node network dependencies:\n${unsupported.join('\n')}`
		);
}

export function cloudflareBuildGuard(): Plugin {
	return {
		name: 'chronos-cloudflare-build-guard',
		apply: 'build',
		generateBundle() {
			assertCloudflareModuleGraph(this.getModuleIds());
		}
	};
}
