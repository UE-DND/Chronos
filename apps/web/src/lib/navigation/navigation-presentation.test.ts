import type { OnNavigate } from '$app/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import { createNavigationPresentation } from './navigation-presentation.svelte';
import {
	getHostPlatform,
	resetHostPlatform,
	setHostPlatform
} from '#lib/platform/host-platform.ts';

vi.mock('svelte', async (importOriginal) => ({
	...(await importOriginal<typeof import('svelte')>()),
	flushSync: (callback?: () => void) => callback?.()
}));
const traversal = vi.hoisted(() => ({
	value: undefined as { from: string; delta: number } | undefined
}));
vi.mock('./nav-coordinator', () => ({ getPendingTraversal: () => traversal.value }));

function deferred<T = void>() {
	let resolve!: (value: T) => void;
	let reject!: (reason: Error) => void;
	const promise = new Promise<T>((done, fail) => {
		resolve = done;
		reject = fail;
	});
	return { promise, resolve, reject };
}
async function flushPromises() {
	for (let i = 0; i < 12; i++) await Promise.resolve();
}
function fixture(initial = '/', snapshots = false) {
	const classes = new Set<string>();
	const views: Array<{
		update: () => Promise<void>;
		finished: ReturnType<typeof deferred<void>>;
		ready: ReturnType<typeof deferred<void>>;
		skipTransition: ReturnType<typeof vi.fn>;
	}> = [];
	const startViewTransition = vi.fn((update: () => Promise<void>) => {
		const finished = deferred();
		const ready = deferred();
		const skipTransition = vi.fn(() => {
			ready.reject(new Error('skipped'));
			finished.resolve();
		});
		views.push({ update, finished, ready, skipTransition });
		return { finished: finished.promise, ready: ready.promise, skipTransition };
	});
	vi.stubGlobal('document', {
		documentElement: {
			classList: {
				contains: (name: string) => classes.has(name),
				add: (...names: string[]) => names.forEach((name) => classes.add(name)),
				remove: (...names: string[]) => names.forEach((name) => classes.delete(name)),
				toggle: (name: string, enabled: boolean) =>
					enabled ? classes.add(name) : classes.delete(name)
			}
		},
		...(snapshots ? { startViewTransition } : {})
	});
	const animations: Array<ReturnType<typeof deferred<boolean>>> = [];
	const animate = (onStart?: () => void) => {
		const task = deferred<boolean>();
		animations.push(task);
		onStart?.();
		return task.promise;
	};
	const motion = {
		animateForwardEnter: vi.fn(animate),
		animateBackExit: vi.fn(animate),
		cancelMotion: vi.fn(() => animations.forEach((task) => task.resolve(false)))
	};
	const controller = createNavigationPresentation(initial, motion);
	controller.syncRoute(initial);
	if (initial !== '/') controller.enableShellHost();
	const navigate = (
		from: string,
		to: string,
		options: { delta?: number; ua?: boolean; shallow?: boolean } = {}
	) => {
		const complete = deferred();
		const blocked = controller.handleNavigation({
			type: options.delta === undefined ? 'goto' : 'popstate',
			delta: options.delta,
			event: { hasUAVisualTransition: options.ua ?? false },
			shallow: options.shallow ?? false,
			from: { url: new URL(from, 'https://app') },
			to: { url: new URL(to, 'https://app') },
			complete: complete.promise
		} as OnNavigate);
		return { complete, blocked };
	};
	return {
		controller,
		state: controller.state,
		navigate,
		motion,
		animations,
		views,
		classes,
		startViewTransition
	};
}

beforeEach(() => {
	vi.stubGlobal('window', { matchMedia: () => ({ matches: false }) });
	traversal.value = undefined;
});
afterEach(() => {
	resetHostPlatform();
	vi.unstubAllGlobals();
});

describe('navigation presentation', () => {
	it('keeps shell-only navigation free of page animations', async () => {
		const h = fixture('/', true);
		const nav = h.navigate('/', '/');
		expect(nav.blocked).toBeUndefined();
		nav.complete.resolve();
		await flushPromises();
		expect(h.startViewTransition).not.toHaveBeenCalled();
		expect(h.motion.animateForwardEnter).not.toHaveBeenCalled();
		expect(h.state).toMatchObject({ transitioning: false, frozen: false, receded: false });
	});

	it.each([
		{ from: '/about', to: '/about/terms', delta: undefined, back: false },
		{
			from: '/open-source-licenses/project',
			to: '/open-source-licenses',
			delta: undefined,
			back: true
		},
		{ from: '/about', to: '/display-settings', delta: undefined, back: false },
		{ from: '/open-source-licenses', to: '/about', delta: -1, back: true },
		{ from: '/about/terms', to: '/about', delta: 1, back: false }
	])(
		'uses route depth or the current history direction for $from → $to',
		async ({ from, to, delta, back }) => {
			const h = fixture(from);
			const nav = h.navigate(from, to, { delta });
			nav.complete.resolve();
			await flushPromises();
			expect(back ? h.motion.animateBackExit : h.motion.animateForwardEnter).toHaveBeenCalledWith(
				expect.any(Function),
				false
			);
			expect(h.state).toMatchObject({ frozen: true, skipPaint: true, receded: true });
			h.animations[0].resolve(true);
			await flushPromises();
			expect(h.state.transitioning).toBe(false);
		}
	);

	it('enables an idle deep-link shell without rendering it in front of the page', () => {
		const controller = createNavigationPresentation('/about');
		expect(controller.state).toMatchObject({ shellHostEnabled: false, frozen: false });
		controller.enableShellHost();
		expect(controller.state).toMatchObject({
			shellHostEnabled: true,
			frozen: true,
			receded: true,
			skipPaint: true
		});
		controller.syncRoute('/');
		expect(controller.state).toMatchObject({ frozen: false, receded: false, skipPaint: false });
	});

	it.each([true, false])(
		'lets UA transitions commit without app motion (snapshots: %s)',
		async (snapshots) => {
			for (const route of [
				{ from: '/display-settings', to: '/', delta: -1, secondary: false },
				{ from: '/about/terms', to: '/about', delta: -1, secondary: true },
				{ from: '/', to: '/display-settings', delta: 1, secondary: true }
			]) {
				const h = fixture(route.from, snapshots);
				const nav = h.navigate(route.from, route.to, { delta: route.delta, ua: true });
				expect(nav.blocked).toBeUndefined();
				nav.complete.resolve();
				await flushPromises();
				expect(h.startViewTransition).not.toHaveBeenCalled();
				expect(h.motion.animateBackExit).not.toHaveBeenCalled();
				expect(h.motion.animateForwardEnter).not.toHaveBeenCalled();
				expect(h.state).toMatchObject({
					transitioning: false,
					frozen: route.secondary,
					receded: route.secondary
				});
			}
		}
	);

	it.each(['system', 'app'])(
		'skips both animation implementations for %s reduced motion',
		async (source) => {
			const h = fixture('/', true);
			if (source === 'system') vi.stubGlobal('window', { matchMedia: () => ({ matches: true }) });
			else h.classes.add('reduce-motion');
			const nav = h.navigate('/', '/about');
			expect(nav.blocked).toBeUndefined();
			nav.complete.resolve();
			await flushPromises();
			expect(h.startViewTransition).not.toHaveBeenCalled();
			expect(h.motion.animateForwardEnter).not.toHaveBeenCalled();
			expect(h.state.frozen).toBe(true);
		}
	);

	it('keeps the shell paintable through DOM entry and ignores shallow marker updates', async () => {
		const h = fixture();
		const nav = h.navigate('/', '/about');
		h.controller.syncRoute('/about');
		expect(h.state.skipPaint).toBe(false);
		expect(h.motion.animateForwardEnter).not.toHaveBeenCalled();
		nav.complete.resolve();
		await flushPromises();
		expect(h.motion.animateForwardEnter).toHaveBeenCalledOnce();
		expect(h.state).toMatchObject({ skipPaint: false, previewPaintReady: true });
		const shallow = h.navigate('/about', '/about', { shallow: true });
		shallow.complete.resolve();
		expect(h.motion.cancelMotion).not.toHaveBeenCalled();
		h.animations[0].resolve(true);
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: true, receded: true });
	});

	it('unfreezes before DOM exit, releases on animation completion, and holds until route commit', async () => {
		const h = fixture('/about');
		const nav = h.navigate('/about', '/', { delta: -1 });
		let released = false;
		void nav.blocked?.then(() => {
			released = true;
		});
		await flushPromises();
		expect(h.state.skipPaint).toBe(false);
		expect(released).toBe(false);
		h.animations[0].resolve(true);
		await flushPromises();
		expect(released).toBe(true);
		expect(h.state.transitioning).toBe(true);
		expect(h.motion.cancelMotion).not.toHaveBeenCalled();
		nav.complete.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: false, receded: false });
		expect(h.motion.cancelMotion).toHaveBeenCalledOnce();
	});

	it('uses DOM animation on native Android even with snapshot support', async () => {
		setHostPlatform({ ...getHostPlatform(), isNative: true, platformType: 'android' });
		const h = fixture('/', true);
		const nav = h.navigate('/', '/about');
		nav.complete.resolve();
		await flushPromises();
		expect(h.startViewTransition).not.toHaveBeenCalled();
		expect(h.motion.animateForwardEnter).toHaveBeenCalledOnce();
		h.controller.dispose();
	});

	it('resolves direction from each navigation, including shallow traversal correction', async () => {
		const h = fixture('/about');
		traversal.value = { from: '/about/terms', delta: -1 };
		const nav = h.navigate('/about', '/about');
		expect(h.motion.animateBackExit).toHaveBeenCalledWith(expect.any(Function), false);
		expect(h.state).toMatchObject({ frozen: true, receded: true });
		h.animations[0].resolve(true);
		nav.complete.resolve();
		await flushPromises();
		traversal.value = undefined;
		const forward = h.navigate('/about', '/about/terms', { delta: 1 });
		forward.complete.resolve();
		await flushPromises();
		expect(h.motion.animateForwardEnter).toHaveBeenCalledWith(expect.any(Function), false);
		h.controller.dispose();
	});

	it('cancels an old entrance without letting its completion freeze the new back navigation', async () => {
		const h = fixture();
		const first = h.navigate('/', '/about');
		first.complete.resolve();
		await flushPromises();
		const back = h.navigate('/about', '/', { delta: -1 });
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: true, frozen: false });
		expect(h.motion.cancelMotion).toHaveBeenCalledOnce();
		h.animations[1].resolve(true);
		back.complete.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: false });
	});

	it.each([false, true])(
		'restores the source immediately on route failure (snapshots: %s)',
		async (snapshots) => {
			const h = fixture('/about', snapshots);
			const nav = h.navigate('/about', '/', { delta: -1 });
			nav.complete.reject(new Error('navigation canceled'));
			await nav.blocked;
			await flushPromises();
			expect(h.state).toMatchObject({
				transitioning: false,
				frozen: true,
				receded: true,
				previewPaintReady: true
			});
			expect(h.classes.size).toBe(0);
			if (snapshots) expect(h.views[0].skipTransition).toHaveBeenCalledOnce();
			else expect(h.motion.cancelMotion).toHaveBeenCalledOnce();
		}
	);

	it('releases a failed DOM exit and settles on the successful destination', async () => {
		const h = fixture('/about');
		const nav = h.navigate('/about', '/');
		h.animations[0].reject(new Error('animation failed'));
		await nav.blocked;
		nav.complete.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: false });
	});

	it('keeps a committed destination when its DOM entrance fails', async () => {
		const h = fixture();
		const nav = h.navigate('/', '/about');
		nav.complete.resolve();
		await flushPromises();
		h.animations[0].reject(new Error('animation failed'));
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: true, receded: true });
		expect(h.motion.cancelMotion).toHaveBeenCalledOnce();
	});

	it('restores the source after a failed UA navigation without app animation', async () => {
		const h = fixture('/about', true);
		const nav = h.navigate('/about', '/', { delta: -1, ua: true });
		nav.complete.reject(new Error('navigation failed'));
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: true });
		expect(h.startViewTransition).not.toHaveBeenCalled();
		expect(h.motion.animateBackExit).not.toHaveBeenCalled();
	});

	it.each([false, true])(
		'disposes a pending exit and ignores late completion (snapshots: %s)',
		async (snapshots) => {
			const h = fixture('/about', snapshots);
			const nav = h.navigate('/about', '/');
			h.controller.dispose();
			await nav.blocked;
			nav.complete.resolve();
			await flushPromises();
			expect(h.state).toMatchObject({ transitioning: false, frozen: true });
			expect(h.classes.size).toBe(0);
			const later = h.navigate('/about', '/display-settings');
			later.complete.resolve();
			await flushPromises();
			expect(h.state.transitioning).toBe(false);
		}
	);
});

describe('snapshot lifecycle', () => {
	it('waits for capture, keeps shell paintable, then freezes only after the snapshot finishes', async () => {
		const h = fixture('/', true);
		const nav = h.navigate('/', '/about');
		let released = false;
		void nav.blocked?.then(() => {
			released = true;
		});
		await flushPromises();
		expect(released).toBe(false);
		expect(h.state).toMatchObject({ previewPaintReady: false, skipPaint: false });
		const update = h.views[0].update();
		await nav.blocked;
		nav.complete.resolve();
		await update;
		h.controller.syncRoute('/about');
		expect(h.state.skipPaint).toBe(false);
		h.views[0].finished.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: true, previewPaintReady: true });
		expect(h.classes.size).toBe(0);
		expect(h.motion.animateForwardEnter).not.toHaveBeenCalled();
	});

	it('reveals the shell for back capture without enabling its interactions', async () => {
		const h = fixture('/about', true);
		const nav = h.navigate('/about', '/', { delta: -1 });
		expect(h.state).toMatchObject({ frozen: true, skipPaint: false, receded: false });
		const update = h.views[0].update();
		nav.complete.resolve();
		await update;
		h.views[0].finished.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ frozen: false, receded: false });
	});

	it('releases navigation when snapshot creation throws', async () => {
		const h = fixture('/', true);
		h.startViewTransition.mockImplementationOnce(() => {
			throw new Error('capture failed');
		});
		const nav = h.navigate('/', '/about');
		await nav.blocked;
		nav.complete.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: true });
		expect(h.classes.size).toBe(0);
	});

	it('does not roll back a committed route when a snapshot fails', async () => {
		const h = fixture('/', true);
		const nav = h.navigate('/', '/about');
		const update = h.views[0].update();
		nav.complete.resolve();
		await update;
		h.views[0].ready.reject(new Error('duplicate view-transition-name'));
		h.views[0].finished.reject(new Error('snapshot failed'));
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: true, receded: true });
		expect(h.classes.size).toBe(0);
	});

	it('releases on skipped capture and waits for the actual route outcome', async () => {
		const h = fixture('/about', true);
		const nav = h.navigate('/about', '/');
		h.views[0].ready.reject(new Error('capture skipped'));
		h.views[0].finished.resolve();
		await nav.blocked;
		nav.complete.resolve();
		await flushPromises();
		expect(h.state).toMatchObject({ transitioning: false, frozen: false });
	});

	it('skips a superseded capture and does not let its callback or cleanup affect the new navigation', async () => {
		const h = fixture('/', true);
		const first = h.navigate('/', '/about');
		const back = h.navigate('/about', '/', { delta: -1 });
		await first.blocked;
		expect(h.views[0].skipTransition).toHaveBeenCalledOnce();
		await h.views[0].update();
		first.complete.resolve();
		await flushPromises();
		expect(h.classes.has('nav-back')).toBe(true);
		expect(h.state.transitioning).toBe(true);
		const update = h.views[1].update();
		back.complete.resolve();
		await update;
		h.views[1].finished.resolve();
		await flushPromises();
		expect(h.classes.size).toBe(0);
		expect(h.state).toMatchObject({ transitioning: false, frozen: false });
	});
});
