import { readFileSync, writeFileSync } from 'node:fs';
import type { BrowserTimings } from './sharding.ts';

const reports = process.argv.slice(2);
if (!reports.length) throw new Error('Pass the durations JSON reports from every browser shard');
const files: BrowserTimings = {};
const sources = new Set<string>();
const shards = new Set<number>();
for (const path of reports) {
	const report = JSON.parse(readFileSync(path, 'utf8'));
	if (report.status !== 'passed')
		throw new Error(`Refusing timings from an unsuccessful run: ${path}`);
	if (!report.files || !Object.keys(report.files).length)
		throw new Error(`Refusing an empty timing report: ${path}`);
	if (
		!report.source ||
		report.shard?.total !== reports.length ||
		!Number.isInteger(report.shard.current) ||
		report.shard.current < 1 ||
		report.shard.current > reports.length ||
		shards.has(report.shard.current)
	)
		throw new Error('Pass every shard exactly once from the same complete browser run');
	shards.add(report.shard.current);
	for (const [file, raw] of Object.entries(report.files)) {
		const timing = raw as { tests?: number; durationMs?: number };
		if (
			!Number.isInteger(timing.tests) ||
			!timing.tests ||
			timing.tests < 0 ||
			!Number.isFinite(timing.durationMs) ||
			!timing.durationMs ||
			timing.durationMs < 0
		)
			throw new Error(`Invalid timing for ${file} in ${path}`);
		if (files[file]) throw new Error(`Duplicate file in timing reports: ${file}`);
		files[file] = { tests: timing.tests, durationMs: timing.durationMs };
	}
	sources.add(String(report.source));
}
if (sources.size !== 1) throw new Error('Timing reports must come from the same browser run');
writeFileSync(
	new URL('./durations.json', import.meta.url),
	`${JSON.stringify({ source: [...sources].join('; '), files: Object.fromEntries(Object.entries(files).sort(([left], [right]) => left.localeCompare(right, 'en'))) }, null, 2)}\n`
);
console.log(`Updated browser timing estimates for ${Object.keys(files).length} files`);
