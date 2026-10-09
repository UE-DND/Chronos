/** Deployment paths are stable across releases and profiles; origins already isolate browser storage. */
export function createStorageNamespace(base: string) {
	const path = base.replace(/\/+$/, '') || '/';
	const prefix = `chronos:${path}:`;
	return {
		prefix,
		databaseName: `${prefix}db`,
		localeCookie: `chronos_${encodeURIComponent(path)}_locale`,
		key: (key: string) => prefix + key
	};
}
