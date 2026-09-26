import type { Disposable } from '@chronos/core';

export interface PluginOperationHandle {
	signal: AbortSignal;
}

export interface RunOperationOptions {
	/** If true, aborts any currently active operation for this plugin before running */
	cancelExisting?: boolean;
	/** Optional external abort signal */
	signal?: AbortSignal;
}

interface PluginQueueEntry {
	controllers: Set<AbortController>;
	tail: Promise<unknown>;
}

export class PluginOperationCoordinator implements Disposable {
	private readonly chains = new Map<string, PluginQueueEntry>();
	private disposed = false;

	isBusy(pluginId: string): boolean {
		return this.chains.has(pluginId);
	}

	getBusyIds(): string[] {
		return Array.from(this.chains.keys());
	}

	async abort(pluginId: string): Promise<void> {
		const entry = this.chains.get(pluginId);
		if (!entry) return;
		for (const ctrl of entry.controllers) {
			ctrl.abort();
		}
		try {
			await entry.tail;
		} catch {
			// Ignore rejection from aborted tasks
		}
	}

	async waitForAllSettled(): Promise<void> {
		const tails = Array.from(this.chains.values()).map((c) => c.tail);
		await Promise.allSettled(tails);
	}

	async run<T>(
		pluginId: string,
		operation: (handle: PluginOperationHandle) => Promise<T>,
		options: RunOperationOptions = {}
	): Promise<T> {
		if (this.disposed) {
			throw new DOMException('Plugin operation coordinator is disposed', 'AbortError');
		}

		const existing = this.chains.get(pluginId);
		if (options.cancelExisting && existing) {
			for (const ctrl of existing.controllers) {
				ctrl.abort();
			}
		}

		const controller = new AbortController();
		let externalCleanup: (() => void) | undefined;

		if (options.signal) {
			if (options.signal.aborted) {
				controller.abort(options.signal.reason);
			} else {
				const onExternalAbort = () => controller.abort(options.signal?.reason);
				options.signal.addEventListener('abort', onExternalAbort, { once: true });
				externalCleanup = () => options.signal?.removeEventListener('abort', onExternalAbort);
			}
		}

		let resolveSettled!: () => void;
		const settled = new Promise<void>((resolve) => {
			resolveSettled = resolve;
		});

		const priorTail = existing ? existing.tail : Promise.resolve();
		const controllers = existing ? existing.controllers : new Set<AbortController>();
		controllers.add(controller);

		this.chains.set(pluginId, {
			controllers,
			tail: settled
		});

		try {
			try {
				await priorTail;
			} catch {
				// Prior operation settled with error or abort; continue to next
			}

			if (this.disposed || controller.signal.aborted) {
				throw new DOMException('Operation aborted', 'AbortError');
			}

			return await operation({ signal: controller.signal });
		} finally {
			controllers.delete(controller);
			externalCleanup?.();
			if (this.chains.get(pluginId)?.tail === settled) {
				this.chains.delete(pluginId);
			}
			resolveSettled();
		}
	}

	dispose(): void {
		if (this.disposed) return;
		this.disposed = true;
		for (const entry of this.chains.values()) {
			for (const ctrl of entry.controllers) {
				ctrl.abort();
			}
		}
		this.chains.clear();
	}
}
