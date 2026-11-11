import 'node:util';

// Node 26.10 added debounce; @types/node 26.6.6 does not declare it yet.
// Remove this overload when upstream types include the API. Only the used surface is declared.
// https://nodejs.org/docs/latest-v26.x/api/util.html#utildebouncefn-wait-options
declare module 'node:util' {
	export function debounce<Args extends unknown[], Result>(
		fn: (...args: Args) => Result,
		wait: number,
		options?: { signal?: AbortSignal }
	): (...args: Args) => Promise<Awaited<Result>>;
}
