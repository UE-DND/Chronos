import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { attachDemoMotion } from './demo-motion';

const environment = vi.hoisted(() => ({ reduced: false }));
vi.mock('@chronos/ui-kit', () => ({ isReducedMotionActive: () => environment.reduced }));
vi.mock('#lib/timetable/timetable-interaction.svelte.ts', () => ({
	TIMETABLE_LONG_PRESS_DELAY_MS: 500
}));
vi.mock('gsap', () => ({
	gsap: {
		context(create: () => void) {
			create();
			return { revert() {} };
		}
	}
}));

function harness() {
	const document = Object.assign(new EventTarget(), {
		hidden: false,
		documentElement: { classList: { contains: () => false } }
	});
	const media = new EventTarget();
	let resize = () => {};
	vi.stubGlobal('document', document);
	vi.stubGlobal('window', { matchMedia: () => media });
	vi.stubGlobal(
		'ResizeObserver',
		class {
			constructor(callback: () => void) {
				resize = callback;
			}
			observe() {}
			disconnect() {}
		}
	);
	vi.stubGlobal(
		'MutationObserver',
		class {
			observe() {}
			disconnect() {}
		}
	);
	const classes = new Set<string>();
	const root = {
		offsetWidth: 300,
		offsetHeight: 200,
		querySelectorAll: () => [],
		classList: {
			toggle: (name: string, enabled: boolean) =>
				enabled ? classes.add(name) : classes.delete(name),
			contains: (name: string) => classes.has(name),
			remove: (name: string) => classes.delete(name)
		}
	};
	const timelines: { paused: boolean; position: number }[] = [];
	const create = () => {
		const state = { paused: false, position: 0 };
		timelines.push(state);
		return {
			pause: () => (state.paused = true),
			resume: () => (state.paused = false)
		} as unknown as ReturnType<Parameters<typeof attachDemoMotion>[1]>;
	};
	return {
		motion: attachDemoMotion(root as unknown as HTMLElement, create),
		timelines,
		resize() {
			root.offsetWidth += 100;
			resize();
		},
		setHidden(hidden: boolean) {
			document.hidden = hidden;
			document.dispatchEvent(new Event('visibilitychange'));
		},
		setReduced(reduced: boolean) {
			environment.reduced = reduced;
			media.dispatchEvent(new Event('change'));
		}
	};
}

afterEach(() => {
	environment.reduced = false;
	vi.unstubAllGlobals();
});

describe('onboarding demo playback', () => {
	it('pauses and resumes the existing timeline without resetting its position', () => {
		const { motion, timelines } = harness();
		timelines[0].position = 4.2;
		motion.setPaused(true);
		expect(timelines[0]).toEqual({ paused: true, position: 4.2 });
		motion.setPaused(false);
		expect(timelines).toEqual([{ paused: false, position: 4.2 }]);
		motion.destroy();
	});

	it('preserves user pause across backgrounding and resize while still suspending background playback', () => {
		const h = harness();
		h.motion.setPaused(true);
		h.setHidden(true);
		h.setHidden(false);
		expect(h.timelines[0].paused).toBe(true);
		h.resize();
		expect(h.timelines).toHaveLength(2);
		expect(h.timelines[1].paused).toBe(true);
		h.setHidden(true);
		h.motion.setPaused(false);
		expect(h.timelines[1].paused).toBe(true);
		h.setHidden(false);
		expect(h.timelines[1].paused).toBe(false);
		h.motion.destroy();
	});

	it('cannot resume through reduced motion and retains user pause when the preference clears', () => {
		const h = harness();
		h.motion.setPaused(true);
		h.setReduced(true);
		h.setHidden(true);
		h.setHidden(false);
		expect(h.timelines).toHaveLength(1);
		expect(h.timelines[0].paused).toBe(true);
		h.setReduced(false);
		expect(h.timelines).toHaveLength(2);
		expect(h.timelines[1].paused).toBe(true);
		h.motion.destroy();
	});
});
