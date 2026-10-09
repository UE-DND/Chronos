import { asset } from '$app/paths';
import type { AssetPath } from '$app/types';

/** Resolve a static file using the configured deploy base and asset origin. */
export function staticPath(path: string): string {
	return asset(path.replace(/^\//, '') as AssetPath);
}
