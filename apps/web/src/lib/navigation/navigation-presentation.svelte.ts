import type { OnNavigate } from '$app/navigation';
import { createContext, flushSync } from 'svelte';
import { getPendingTraversal } from './nav-coordinator';
import { isSecondaryRoute, toAppPathname } from './routes';
import { getHostPlatform } from '#lib/platform/host-platform.ts';
import {
	createRouteMotionController,
	isReducedMotionActive,
	type RouteMotionController
} from './route-motion-controller.svelte';

type Direction = 'forward' | 'back' | 'none';
type Presentation = {
	mode: 'none' | 'snapshot' | 'dom';
	stage: 'preparing' | 'running';
	fromSecondary: boolean;
	toSecondary: boolean;
};
const NAV_CLASSES = ['nav-forward', 'nav-back', 'vt-cross-shell'];

function navigationDirection(from: string, to: string, delta?: number): Direction {
	if (!from || !to || (!isSecondaryRoute(from) && !isSecondaryRoute(to))) return 'none';
	if (delta !== undefined) return delta > 0 ? 'forward' : 'back';
	if (!isSecondaryRoute(from)) return 'forward';
	if (!isSecondaryRoute(to)) return 'back';
	const depth = (path: string) => toAppPathname(path).split('/').filter(Boolean).length;
	return depth(to) < depth(from) ? 'back' : 'forward';
}

/** Owns route visuals; history and return-target selection stay in the coordinator. */
export function createNavigationPresentation(
	initialPathname: string,
	motion: RouteMotionController = createRouteMotionController()
) {
	let committedPath = $state(initialPathname);
	let shellHostEnabled = $state(false);
	let phase = $state.raw<Presentation | null>(null);
	let active: { cancel(): void } | null = null;
	let disposed = false;

	function syncRoute(pathname: string): void {
		if (disposed) return;
		committedPath = pathname;
		if (!isSecondaryRoute(pathname)) shellHostEnabled = true;
	}

	function frozen(): boolean {
		if (!shellHostEnabled) return false;
		if (!phase || phase.mode === 'none') return isSecondaryRoute(committedPath);
		if (phase.mode === 'dom' && phase.fromSecondary !== phase.toSecondary) return false;
		return phase.fromSecondary;
	}

	const state = {
		get shellHostEnabled() {
			return shellHostEnabled;
		},
		get transitioning() {
			return phase !== null;
		},
		get frozen() {
			return frozen();
		},
		get receded() {
			if (!shellHostEnabled) return false;
			if (!phase || phase.mode === 'none') return isSecondaryRoute(committedPath);
			if (phase.mode === 'snapshot') return phase.toSecondary && phase.fromSecondary;
			return phase.stage === 'running' ? phase.toSecondary : phase.fromSecondary;
		},
		get skipPaint() {
			return frozen() && !(phase?.mode === 'snapshot' && !phase.toSecondary);
		},
		get previewPaintReady() {
			return phase?.mode !== 'snapshot';
		}
	};

	function handleNavigation(navigation: OnNavigate): Promise<void> | undefined {
		// Shallow marker writes must not cancel the route transition that caused them.
		if (disposed || (navigation.shallow && navigation.type === 'goto')) return;
		active?.cancel();
		const traversal = getPendingTraversal();
		const from = traversal?.from ?? navigation.from?.url.pathname ?? committedPath;
		const to = navigation.to?.url.pathname ?? from;
		const delta =
			traversal?.delta ?? (navigation.type === 'popstate' ? navigation.delta : undefined);
		const direction = navigationDirection(from, to, delta);
		const platform = getHostPlatform();
		const uaTransition = navigation.type === 'popstate' && navigation.event.hasUAVisualTransition;
		const mode =
			uaTransition || isReducedMotionActive() || direction === 'none'
				? 'none'
				: !(platform.isNative && platform.platformType === 'android') &&
					  typeof document.startViewTransition === 'function'
					? 'snapshot'
					: 'dom';
		const presentation: Presentation = {
			mode,
			stage: 'preparing',
			fromSecondary: isSecondaryRoute(from),
			toSecondary: isSecondaryRoute(to)
		};
		const crossShell = presentation.fromSecondary !== presentation.toSecondary;
		let release = () => {};
		const blocked =
			mode === 'snapshot' || (mode === 'dom' && direction === 'back')
				? new Promise<void>((resolve) => {
						release = resolve;
					})
				: undefined;
		let view: ViewTransition | undefined;
		const session = { cancel: () => finish() };
		active = session;
		flushSync(() => {
			phase = presentation;
		});

		// Every exit, including supersession and teardown, releases router waits and resources.
		function finish(pathname = committedPath): void {
			if (active !== session) return;
			active = null;
			flushSync(() => {
				phase = null;
				syncRoute(pathname);
			});
			release();
			view?.skipTransition();
			if (mode === 'snapshot') document.documentElement.classList.remove(...NAV_CLASSES);
			if (mode === 'dom') motion.cancelMotion();
		}

		const completed = navigation.complete.then(
			() => {
				if (active === session) syncRoute(to);
				return true;
			},
			() => {
				finish(from);
				return false;
			}
		);
		const startDom = () => {
			if (active === session)
				flushSync(() => {
					phase = { ...presentation, stage: 'running' };
				});
		};

		async function animate(): Promise<void> {
			if (mode === 'snapshot') {
				document.documentElement.classList.add(`nav-${direction}`);
				document.documentElement.classList.toggle('vt-cross-shell', crossShell);
				view = document.startViewTransition(async () => {
					release();
					if (active !== session) return;
					await completed;
					if (active === session) flushSync();
				});
				// A skipped capture still runs its update callback, but must never block routing.
				void view.ready.catch(release);
				await view.finished;
			} else if (mode === 'dom') {
				if (direction === 'back') await motion.animateBackExit(startDom, crossShell);
				else if ((await completed) && active === session)
					await motion.animateForwardEnter(startDom, crossShell);
			}
		}

		// Animation failures only end visuals. The router alone decides the committed page.
		void animate()
			.catch(() => {})
			.then(async () => {
				release();
				if (await completed) finish(to);
			});
		return blocked;
	}

	return {
		state,
		handleNavigation,
		syncRoute,
		enableShellHost() {
			if (!disposed) shellHostEnabled = true;
		},
		dispose() {
			active?.cancel();
			disposed = true;
		}
	};
}

export type NavigationPresentation = ReturnType<typeof createNavigationPresentation>;
export const [getNavigationPresentation, setNavigationPresentation] =
	createContext<NavigationPresentation>();
