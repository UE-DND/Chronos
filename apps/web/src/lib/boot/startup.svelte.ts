import { withStartupDeadline } from './startup-deadline';

type Phase = 'pending' | 'running' | 'ready' | 'failed';
type Stage = 'core' | 'plugins';
type StartupState = {
	readonly core: Phase;
	readonly plugins: Phase;
	readonly display: 'pending' | 'loading' | 'content' | 'error';
	readonly timetableFallback: boolean;
	readonly failure: { stage: Stage; elapsedMs: number; reason: string } | null;
};
const initial = (): StartupState => ({
	core: 'pending',
	plugins: 'pending',
	display: 'pending',
	timetableFallback: false,
	failure: null
});

export function createStartupController(
	report: (failure: NonNullable<StartupState['failure']>, error: unknown) => void = (
		failure,
		error
	) => console.error('[startup]', failure, error)
) {
	let state = $state.raw<StartupState>(initial());
	let generation = 0;
	let sessionAbort = new AbortController();
	const attempts = new Map<Stage, Promise<unknown>>();
	function run<T>(stage: Stage, milliseconds: number, work: () => Promise<T>): Promise<T> {
		const existing = attempts.get(stage);
		if (existing) return existing as Promise<T>;
		const session = generation;
		const started = performance.now();
		state = { ...state, [stage]: 'running' };
		const attempt = withStartupDeadline(stage, milliseconds, work, sessionAbort.signal).then(
			(value) => {
				if (session !== generation) throw new Error('Startup session disposed');
				state = { ...state, [stage]: 'ready' };
				performance.mark?.(`chronos-${stage}-ready`);
				return value;
			},
			(error: unknown) => {
				if (session === generation) {
					const failure = { stage, elapsedMs: performance.now() - started, reason: String(error) };
					state = { ...state, [stage]: 'failed', failure };
					report(failure, error);
				}
				throw error;
			}
		);
		attempts.set(stage, attempt);
		// Background startup still reports failure; callers awaiting readiness receive the rejection.
		void attempt.catch(() => {});
		return attempt;
	}
	return {
		get state() {
			return state;
		},
		prepareCore<T>(work: () => Promise<T>) {
			return run('core', 25_000, work);
		},
		restorePlugins<T>(work: () => Promise<T>) {
			return run('plugins', 10_000, work);
		},
		enterTimetable() {
			if (state.core !== 'ready' || state.plugins !== 'failed') return false;
			state = { ...state, timetableFallback: true };
			return true;
		},
		markDisplayed(display: StartupState['display']) {
			if (state.core === 'pending' || state.core === 'running') return;
			if (state.display === display) return;
			state = { ...state, display };
		},
		reset() {
			generation++;
			sessionAbort.abort(new Error('Startup session disposed'));
			sessionAbort = new AbortController();
			attempts.clear();
			state = initial();
		}
	};
}

export const appStartup = createStartupController();
