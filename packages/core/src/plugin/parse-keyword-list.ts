/** Split a comma-separated translation into trimmed, non-empty keywords. */
export function parseKeywordList(value: string): string[] {
	return value
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
}
