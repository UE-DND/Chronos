let activeMode: string | undefined;
let users = 0;
let previous: string | undefined;
const waiters = new Set<() => void>();
/** Vite derives production conditions from NODE_ENV, even with an explicit mode.
 * Keep same-mode builds concurrent, but isolate mixed programmatic callers. */
export async function withBuildEnvironment<T>(
	mode: 'dev' | 'production',
	build: () => Promise<T>
): Promise<T> {
	const value = mode === 'dev' ? 'development' : 'production';
	while (users > 0 && activeMode !== value) await new Promise<void>((done) => waiters.add(done));
	if (users === 0) {
		previous = process.env.NODE_ENV;
		process.env.NODE_ENV = value;
		activeMode = value;
	}
	users++;
	try {
		return await build();
	} finally {
		users--;
		if (users === 0) {
			if (previous === undefined) delete process.env.NODE_ENV;
			else process.env.NODE_ENV = previous;
			activeMode = undefined;
			const ready = [...waiters];
			waiters.clear();
			ready.forEach((done) => done());
		}
	}
}
