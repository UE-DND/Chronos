/** Coordinates local selection writes and rejects obsolete storage snapshots. */
export class TimetableSelection {
	private revision = 0;
	private pending = 0;
	private queue: Promise<unknown> = Promise.resolve();

	async change<T>(action: () => Promise<T>): Promise<T> {
		this.revision += 1;
		this.pending += 1;
		const result = this.queue.then(action);
		this.queue = result.catch(() => {});
		try {
			return await result;
		} finally {
			this.pending -= 1;
			this.revision += 1;
		}
	}

	async whenSettled(): Promise<void> {
		while (this.pending > 0) await this.queue;
	}

	snapshot(): number {
		return ++this.revision;
	}
	isCurrent(revision: number): boolean {
		return this.pending === 0 && revision === this.revision;
	}
	invalidate(): void {
		this.revision += 1;
	}
}
