/** Domain views cannot mutate nested records or collections. */
export type DeepReadonly<T> = T extends (...args: never[]) => unknown
	? T
	: T extends Date
		? T
		: T extends object
			? { readonly [K in keyof T]: DeepReadonly<T[K]> }
			: T;
