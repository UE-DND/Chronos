import type { OnNavigate } from '$app/navigation';
import { afterEach, describe, expect, it, vi } from 'vite-plus/test';

import {
	createSecondaryTransitionGate,
	setupSecondaryPageViewTransition,
	updateTransitionDirection
} from './page-view-transition.svelte';
import {
	getHostPlatform,
	resetHostPlatform,
	setHostPlatform
} from '#lib/platform/host-platform.ts';

const captured = vi.hoisted(() => ({
	callback: undefined as ((nav: OnNavigate) => unknown) | undefined
}));
vi.mock('$app/navigation', () => ({
	onNavigate: (callback: (nav: OnNavigate) => unknown) => {
		captured.callback = callback;
	}
}));

// Node resolves Svelte's server entry, whose flushSync is a noop.
vi.mock('svelte', async (importOriginal) => ({
	...(await importOriginal<typeof import('svelte')>()),
	flushSync: (callback?: () => void) => callback?.()
}));

function deferred<T = void>() {
	let resolve!: (value: T) => void;
	let reject!: (error: Error) => void;
	const promise = new Promise<T>((done, fail) => {
		resolve = done;
		reject = fail;
	});
	return { promise, resolve, reject };
}

async function flushPromises() {
	for (let i = 0; i < 8; i++) await Promise.resolve();
}

function fixture() {
	setHostPlatform({ ...getHostPlatform(), isNative: true, platformType: 'android' });
	const gate = createSecondaryTransitionGate();
	gate.syncRoute('/');
	const enter = deferred<boolean>();
	const exit = deferred<boolean>();
	const motion = {
		cancelMotion: vi.fn(),
		animateForwardEnter: vi.fn((onStart?: () => void) => {
			onStart?.();
			return enter.promise;
		}),
		animateBackExit: vi.fn((onStart?: () => void) => {
			onStart?.();
			return exit.promise;
		})
	};
	setupSecondaryPageViewTransition(gate, motion);
	function navigate(from: string, to: string) {
		const complete = deferred();
		updateTransitionDirection(from, to, 'goto');
		const blocked = captured.callback!({
			type: 'goto',
			from: { url: new URL(from, 'https://localhost') },
			to: { url: new URL(to, 'https://localhost') },
			complete: complete.promise
		} as unknown as OnNavigate);
		return { complete, blocked };
	}
	return { gate, enter, exit, motion, navigate };
}

afterEach(() => resetHostPlatform());

describe('native route motion coordination', () => {
	it('does not cancel an entrance when Kit reports a shallow history update', async () => {
		const { gate, enter, motion, navigate } = fixture();
		const forward = navigate('/', '/about');
		gate.syncRoute('/about');
		forward.complete.resolve();
		await flushPromises();
		const cancellations = motion.cancelMotion.mock.calls.length;
		const shallow = captured.callback!({ type: 'goto', shallow: true } as OnNavigate);
		expect(shallow).toBeUndefined();
		expect(motion.cancelMotion).toHaveBeenCalledTimes(cancellations);
		enter.resolve(true);
		await flushPromises();
		expect(gate.frozen).toBe(true);
	});

	it('keeps the shell paintable through the forward route commit and freezes only after animation', async () => {
		const { gate, enter, motion, navigate } = fixture();
		const nav = navigate('/', '/about');
		gate.syncRoute('/about');
		expect(gate.skipPaint).toBe(false);
		expect(gate.previewPaintReady).toBe(true);
		expect(motion.animateForwardEnter).not.toHaveBeenCalled();
		nav.complete.resolve();
		await flushPromises();
		expect(motion.animateForwardEnter).toHaveBeenCalledOnce();
		expect(gate.skipPaint).toBe(false);
		enter.resolve(true);
		await flushPromises();
		expect(gate.skipPaint).toBe(true);
	});

	it('reveals the shell before the first back frame and waits before committing the route', async () => {
		const { gate, exit, navigate } = fixture();
		gate.syncRoute('/about');
		const nav = navigate('/about', '/');
		let released = false;
		void Promise.resolve(nav.blocked).then(() => (released = true));
		await flushPromises();
		expect(gate.skipPaint).toBe(false);
		expect(released).toBe(false);
		exit.resolve(true);
		await flushPromises();
		expect(released).toBe(true);
		expect(gate.transitioning).toBe(true);
		nav.complete.resolve();
		await flushPromises();
		expect(gate.transitioning).toBe(false);
		expect(gate.frozen).toBe(false);
	});

	it('does not let an interrupted entrance freeze the newer back transition', async () => {
		const { gate, enter, exit, navigate } = fixture();
		const forward = navigate('/', '/about');
		forward.complete.resolve();
		await flushPromises();
		const back = navigate('/about', '/');
		enter.resolve(false);
		await flushPromises();
		expect(gate.frozen).toBe(false);
		expect(gate.transitioning).toBe(true);
		exit.resolve(true);
		back.complete.resolve();
		await flushPromises();
		expect(gate.frozen).toBe(false);
		expect(gate.transitioning).toBe(false);
	});

	it('restores the source gate after failed back navigation and releases its wait', async () => {
		const { gate, exit, navigate } = fixture();
		gate.syncRoute('/about');
		const back = navigate('/about', '/');
		exit.resolve(true);
		await flushPromises();
		back.complete.reject(new Error('navigation failed'));
		await flushPromises();
		await back.blocked;
		expect(gate.frozen).toBe(true);
		expect(gate.receded).toBe(true);
		expect(gate.transitioning).toBe(false);
	});
	it('settles a failed non-animated navigation without leaving the previous gate in flight', async () => {
		const { gate, navigate } = fixture();
		gate.prepareRealDomTransition(true);
		const nav = navigate('/', '/');
		nav.complete.reject(new Error('navigation failed'));
		await flushPromises();
		expect(gate.transitioning).toBe(false);
		expect(gate.frozen).toBe(false);
	});
});
