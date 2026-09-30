export function formatBytes(bytes: number, fractionDigits = 1): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(fractionDigits)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(fractionDigits)} MB`;
}
