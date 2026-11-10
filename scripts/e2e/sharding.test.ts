import { describe, expect, it } from 'vite-plus/test';
import { planBrowserShards } from './sharding.ts';

describe('browser shard assignment', () => {
	it('balances measured work and adjusts estimates when a file gains or loses tests', () => {
		const files = [
			{ file: 'pager.spec.ts', tests: 4 },
			{ file: 'settings.spec.ts', tests: 2 },
			{ file: 'editor.spec.ts', tests: 2 },
			{ file: 'startup.spec.ts', tests: 1 }
		];
		const timings = {
			'pager.spec.ts': { tests: 8, durationMs: 80_000 },
			'settings.spec.ts': { tests: 2, durationMs: 20_000 },
			'editor.spec.ts': { tests: 2, durationMs: 20_000 },
			'startup.spec.ts': { tests: 1, durationMs: 1_000 }
		};
		const shards = planBrowserShards(files, timings, 2);
		const estimates = shards.map((shard) =>
			shard.reduce((sum, file) => {
				const timing = timings[file as keyof typeof timings];
				return (
					sum + (timing.durationMs / timing.tests) * files.find((item) => item.file === file)!.tests
				);
			}, 0)
		);
		expect(Math.max(...estimates) - Math.min(...estimates)).toBe(1_000);
	});

	it('includes new files exactly once, ignores removed files and stays deterministic', () => {
		const files = ['new/nested.spec.ts', 'empty.spec.ts', 'known.spec.ts', 'other.spec.ts'].map(
			(file, tests) => ({ file, tests })
		);
		const timings = {
			'known.spec.ts': { tests: 2, durationMs: 10_000 },
			'removed.spec.ts': { tests: 1, durationMs: 90_000 }
		};
		const shards = planBrowserShards(files, timings, 4);
		expect(shards.flat().sort()).toEqual(files.map(({ file }) => file).sort());
		expect(new Set(shards.flat()).size).toBe(files.length);
		expect(planBrowserShards([...files].reverse(), timings, 4)).toEqual(shards);
	});

	it('covers every file without timing history and supports more shards than files', () => {
		const files = [{ file: 'new.spec.ts', tests: 3 }];
		expect(planBrowserShards(files, {}, 4).flat()).toEqual(['new.spec.ts']);
		expect(() => planBrowserShards(files, {}, 0)).toThrow('positive integer');
		expect(() =>
			planBrowserShards(files, { 'new.spec.ts': { tests: 0, durationMs: 1 } }, 4)
		).toThrow('Invalid browser timing');
	});
});
