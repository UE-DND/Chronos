import { describe, expect, it } from 'vite-plus/test';
import { mapWithConcurrency } from '../src/online/concurrency';

describe('mapWithConcurrency', () => {
	it('preserves result order with limited concurrency', async () => {
		const items = [1, 2, 3, 4];
		const gates = items.map(() => Promise.withResolvers<void>());
		const started = items.map(() => Promise.withResolvers<void>());
		const active = new Set<number>();
		const pending = mapWithConcurrency(items, 2, async (item, index) => {
			active.add(index);
			started[index]!.resolve();
			await gates[index]!.promise;
			active.delete(index);
			return item * 2;
		});

		try {
			expect([...active]).toEqual([0, 1]);
			// Finish later inputs first while the first input remains blocked.
			gates[1]!.resolve();
			await started[2]!.promise;
			expect([...active]).toEqual([0, 2]);
			gates[2]!.resolve();
			await started[3]!.promise;
			expect([...active]).toEqual([0, 3]);
			gates[3]!.resolve();
			gates[0]!.resolve();
			expect(await pending).toEqual([2, 4, 6, 8]);
		} finally {
			for (const gate of gates) gate.resolve();
			await pending;
		}
	});
});
