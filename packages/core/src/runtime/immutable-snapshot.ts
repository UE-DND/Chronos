/** Own and freeze a JSON-compatible domain snapshot once when accepting it. */
export function immutableSnapshot<T>(value: T): T {
	if (value === null || typeof value !== 'object') return value;
	if (value instanceof Date) return new Date(value.getTime()) as T;
	const copy = Array.isArray(value)
		? value.map((entry: unknown) => immutableSnapshot(entry))
		: Object.fromEntries(
				Object.entries(value).map(([key, entry]) => [key, immutableSnapshot(entry)])
			);
	return Object.freeze(copy) as T;
}
