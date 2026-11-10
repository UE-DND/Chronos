export interface BrowserTiming {
	tests: number;
	durationMs: number;
}

export type BrowserTimings = Record<string, BrowserTiming>;

/** Keep each file together: several browser tests share deployment state through one server. */
export function planBrowserShards(
	files: { file: string; tests: number }[],
	timings: BrowserTimings,
	total: number
): string[][] {
	if (!Number.isInteger(total) || total < 1)
		throw new Error('Shard total must be a positive integer');
	for (const [file, timing] of Object.entries(timings)) {
		if (
			!Number.isInteger(timing.tests) ||
			timing.tests <= 0 ||
			!Number.isFinite(timing.durationMs) ||
			timing.durationMs <= 0
		)
			throw new Error(`Invalid browser timing: ${file}`);
	}
	const averages = files
		.flatMap(({ file }) => (timings[file] ? [timings[file].durationMs / timings[file].tests] : []))
		.sort((left, right) => left - right);
	const fallback = averages[Math.floor(averages.length / 2)] ?? 1_000;
	const work = files.map(({ file, tests }) => ({
		file,
		duration:
			Math.max(1, tests) *
			(timings[file] ? timings[file].durationMs / timings[file].tests : fallback)
	}));
	work.sort(
		(left, right) => right.duration - left.duration || left.file.localeCompare(right.file, 'en')
	);
	const shards = Array.from({ length: total }, () => ({ files: [] as string[], duration: 0 }));
	for (const item of work) {
		const shard = shards.reduce((lightest, candidate) =>
			candidate.duration < lightest.duration ? candidate : lightest
		);
		shard.files.push(item.file);
		shard.duration += item.duration;
	}
	return shards.map(({ files }) => files.sort());
}
