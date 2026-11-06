export function hasClosest(target: unknown): target is { closest: (selector: string) => unknown } {
	return (
		typeof target === 'object' &&
		target !== null &&
		'closest' in target &&
		typeof (target as { closest?: unknown }).closest === 'function'
	);
}
