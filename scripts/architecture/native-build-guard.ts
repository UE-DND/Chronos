import type { Plugin } from 'vite';

export function assertWebModuleGraph(ids: Iterable<string>): void {
	const native = [...ids].filter((id) =>
		/(?:node_modules\/|\.pnpm\/)@capacitor(?:\/|\+)/.test(id.replaceAll('\\', '/'))
	);
	if (native.length)
		throw new Error(`Pure Web build includes native dependencies:\n${native.join('\n')}`);
}

/** Check the resolved graph, including native dependencies hidden behind external libraries. */
export function nativeBuildGuard(mobile: boolean): Plugin {
	return {
		name: 'chronos-native-build-guard',
		apply: 'build',
		generateBundle() {
			if (!mobile) assertWebModuleGraph(this.getModuleIds());
		}
	};
}
