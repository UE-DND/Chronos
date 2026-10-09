const RESULT_KEY = 'chronos:storage-persistence';

/** One attempt per host session, after user data has successfully been saved. */
export function createPersistentStorageRequest(
	manager: Pick<StorageManager, 'persisted' | 'persist'> | undefined,
	storage: Storage | null
): () => Promise<void> {
	let pending: Promise<void> | undefined;
	return () => {
		pending ??= (async () => {
			let result: 'granted' | 'denied' | 'unsupported' | 'error';
			try {
				if (!manager?.persist || !manager.persisted) {
					result = 'unsupported';
				} else {
					const granted = (await manager.persisted()) || (await manager.persist());
					result = granted ? 'granted' : 'denied';
				}
			} catch (error) {
				result = 'error';
				console.warn('[storage] Persistent storage request failed:', error);
			}
			try {
				storage?.setItem(RESULT_KEY, result);
			} catch (error) {
				console.warn('[storage] Could not record persistence result:', error);
			}
		})();
		return pending;
	};
}
