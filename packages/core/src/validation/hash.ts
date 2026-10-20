/** Lowercase SHA-256 digest as emitted by the build and runtime hash helpers. */
export function isSha256Hex(value: string): boolean {
	return /^[a-f0-9]{64}$/.test(value);
}

/** Lowercase full Git commit hash. */
export function isGitCommitHash(value: string): boolean {
	return /^[a-f0-9]{40}$/.test(value);
}
