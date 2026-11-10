import { mkdirSync, writeFileSync } from 'node:fs';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
	FullConfig,
	FullResult,
	Reporter,
	TestCase,
	TestResult
} from '@playwright/test/reporter';
import history from './durations.json' with { type: 'json' };
import { planBrowserShards, type BrowserTimings } from './sharding.ts';

export default class BrowserShardingReporter implements Reporter {
	private config!: FullConfig;
	private timings: BrowserTimings = {};
	private completed = new Set<string>();

	async preprocess({ config, suite, testRun }: Parameters<NonNullable<Reporter['preprocess']>>[0]) {
		this.config = config;
		if (!config.shard) return;
		const tests = suite.allTests();
		const files = new Map<string, number>();
		for (const test of tests) {
			const file = this.file(test);
			files.set(file, (files.get(file) ?? 0) + Number(test.expectedStatus !== 'skipped'));
		}
		const shards = planBrowserShards(
			[...files].map(([file, tests]) => ({ file, tests })),
			history.files,
			config.shard.total
		);
		const selected = new Set(shards[config.shard.current - 1]);
		testRun.skipSharding();
		for (const test of tests) if (!selected.has(this.file(test))) testRun.exclude(test);
	}

	onTestEnd(test: TestCase, result: TestResult) {
		if (result.status === 'skipped') return;
		const timing = (this.timings[this.file(test)] ??= { tests: 0, durationMs: 0 });
		timing.durationMs += result.duration;
		if (!this.completed.has(test.id)) timing.tests++;
		this.completed.add(test.id);
	}

	onEnd(result: FullResult) {
		// Collection-only runs must not overwrite timings from a completed run.
		if (!this.completed.size) return;
		const output = fileURLToPath(new URL('../../dist/e2e/', import.meta.url));
		mkdirSync(output, { recursive: true });
		writeFileSync(
			resolve(output, `durations-${this.config.shard?.current ?? 'all'}.json`),
			`${JSON.stringify(
				{
					source: process.env.GITHUB_RUN_ID
						? `GitHub Actions run ${process.env.GITHUB_RUN_ID}, attempt ${process.env.GITHUB_RUN_ATTEMPT}`
						: 'local browser run',
					status: result.status,
					shard: this.config.shard ?? { current: 1, total: 1 },
					files: Object.fromEntries(
						Object.entries(this.timings).sort(([left], [right]) => left.localeCompare(right, 'en'))
					)
				},
				null,
				2
			)}\n`
		);
	}

	private file(test: TestCase) {
		return relative(this.config.rootDir, test.location.file).split(sep).join('/');
	}
}
