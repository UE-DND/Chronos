export function isAbortError(err: unknown): boolean {
	if (!err) return false;
	if (typeof err === 'object' && 'name' in err && (err as { name: string }).name === 'AbortError') {
		return true;
	}
	if (err instanceof Error && (err.message === 'Aborted' || err.name === 'AbortError')) {
		return true;
	}
	return false;
}
