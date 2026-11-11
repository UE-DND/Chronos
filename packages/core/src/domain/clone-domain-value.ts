/** Copy JSON-compatible domain values into independently editable records and arrays. */
export function cloneDomainValue<T>(value: T): T {
	if (value === null || typeof value !== 'object') return value;
	if (value instanceof Date) return new Date(value.getTime()) as T;
	return (
		Array.isArray(value)
			? value.map((entry: unknown) => cloneDomainValue(entry))
			: Object.fromEntries(
					Object.entries(value).map(([key, entry]) => [key, cloneDomainValue(entry)])
				)
	) as T;
}
