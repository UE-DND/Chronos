import type { Plugin } from 'vite';

/** Rolldown exposes addWatchFile but not Rollup's getWatchFiles. Observe the
 * registrations made by Vite/Svelte/Tailwind without starting another watcher. */
export function watchInputs(files: Set<string>): Plugin {
	return {
		name: 'chronos-observe-build-inputs',
		configResolved(config) {
			for (const plugin of config.plugins) {
				const hooks = plugin as unknown as Record<string, unknown>;
				for (const name of ['buildStart', 'resolveId', 'load', 'transform', 'generateBundle']) {
					const hook = hooks[name];
					const handler =
						typeof hook === 'function'
							? hook
							: hook && typeof hook === 'object'
								? (hook as { handler?: unknown }).handler
								: undefined;
					if (typeof handler !== 'function') continue;
					const wrapped = function (this: object, ...args: unknown[]) {
						const context = new Proxy(this, {
							get(target, property) {
								const value: unknown = Reflect.get(target, property, target);
								if (property === 'addWatchFile' && typeof value === 'function')
									return (path: string) => {
										files.add(path);
										return value.call(target, path);
									};
								return typeof value === 'function' ? value.bind(target) : value;
							}
						});
						return handler.apply(context, args);
					};
					hooks[name] =
						typeof hook === 'function' ? wrapped : { ...(hook as object), handler: wrapped };
				}
			}
		}
	};
}
