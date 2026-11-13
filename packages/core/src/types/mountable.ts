/** Marker for plugin-bundle UI that must mount with its own Svelte runtime. */
export const CHRONOS_MOUNTABLE = Symbol.for('chronos.mountable');

export type ChronosMountHandle<P extends object = object> = {
	update?(props: P): void;
	unmount(): void;
};

export interface ChronosMountable<Props extends object = object> {
	readonly [CHRONOS_MOUNTABLE]: true;
	mount(
		target: HTMLElement,
		props: Props,
		lifecycle?: { onError(error: unknown): void }
	): ChronosMountHandle<Props>;
}

export function isChronosMountable(value: unknown): value is ChronosMountable {
	if (typeof value !== 'object' || value === null) return false;
	const record = value as Record<symbol, unknown>;
	return (
		record[CHRONOS_MOUNTABLE] === true && typeof (value as ChronosMountable).mount === 'function'
	);
}

export function isChronosMountHandle(value: unknown): value is ChronosMountHandle {
	if (!value || typeof value !== 'object') return false;
	const handle = value as ChronosMountHandle;
	return (
		typeof handle.unmount === 'function' &&
		(handle.update === undefined || typeof handle.update === 'function')
	);
}
