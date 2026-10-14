import type { BeforeNavigate } from '$app/navigation';
import { resolveBack, resolveTraversal, type BackFallback } from './back-resolver';
import {
	findRecord,
	getNavigationSnapshot,
	getTopFrame,
	getTopRoute,
	initNavStack,
	invalidateOverlays,
	markerFor,
	moveToRecord,
	pushOverlay,
	pushRoute,
	type NavFrame
} from './nav-stack';
import { appRouteHref, isShellRoute } from './routes';

export type NavigationCoordinatorDeps = {
	goto: (href: string, opts?: { replace?: boolean }) => void | Promise<void>;
	pushState: (url: string, state: App.PageState) => void;
	replaceState: (url: string, state: App.PageState) => void;
	getPage: () => { url: URL; state: App.PageState };
	setActiveTab: (tabId: string) => void;
	historyGo: (delta: number) => void;
};
let deps: NavigationCoordinatorDeps | undefined;
interface CoordinatorState {
	ready: boolean;
	whenReady: Promise<void>;
	completeInitialization?: () => void;
	renderingTarget?: NavFrame;
	intent?: { type: string; replace: boolean; shellTab?: string };
	departureTab?: string;
	requestedReplace: boolean;
	backPending: boolean;
	correctingFrom?: string;
	fallbackRegistration?: { fallback: BackFallback };
	pendingFallbackTab?: string;
}

function createCoordinatorState(): CoordinatorState {
	let completeInitialization: (() => void) | undefined;
	const whenReady = new Promise<void>((resolve) => {
		completeInitialization = resolve;
	});
	return {
		ready: false,
		whenReady,
		completeInitialization,
		requestedReplace: false,
		backPending: false
	};
}

let state = createCoordinatorState();
let requestId = 0;
const navigationCompletionWaiters = new Set<() => void>();
function href(url: URL): string {
	return url.pathname + url.search + url.hash;
}
function writeMarker(frame: NavFrame): void {
	if (deps) {
		const page = deps.getPage();
		deps.replaceState(href(page.url), { ...page.state, chronosNavigation: markerFor(frame) });
	}
}
export function configureNavigationCoordinator(next: NavigationCoordinatorDeps): void {
	deps = next;
	++requestId;
	state = createCoordinatorState();
}
export function registerPageBackFallback(fallback: BackFallback): () => void {
	const registration = { fallback };
	state.fallbackRegistration = registration;
	return () => {
		if (state.fallbackRegistration === registration) state.fallbackRegistration = undefined;
	};
}
export async function navigateForward(
	url: string,
	opts: { replace?: boolean } = {}
): Promise<void> {
	if (!deps || state.backPending) return;
	const request = ++requestId;
	state.requestedReplace = opts.replace ?? getTopFrame()?.kind === 'overlay';
	try {
		await deps.goto(appRouteHref(url), { replace: state.requestedReplace });
	} finally {
		if (request === requestId) {
			state.requestedReplace = false;
			state.intent = undefined;
		}
	}
}
export function navigateBack(
	fallback = state.fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback)
): void {
	void performNavigateBack(fallback);
}

/** Navigate back and resolve after SvelteKit commits the destination route. */
export function navigateBackAndWait(
	fallback = state.fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback)
): Promise<void> {
	return performNavigateBack(fallback);
}

function performNavigateBack(fallback: BackFallback): Promise<void> {
	if (!deps || state.backPending) return Promise.resolve();
	const plan = resolveBack(getNavigationSnapshot(), fallback);
	state.backPending = true;
	if (
		plan.type === 'traverse' &&
		findRecord(deps.getPage().state.chronosNavigation)?.id === getTopFrame()?.id
	) {
		const completed = new Promise<void>((resolve) => {
			navigationCompletionWaiters.add(resolve);
		});
		deps.historyGo(plan.delta);
		return completed;
	}
	const target = plan.type === 'fallback' ? plan.fallback : fallback;
	state.pendingFallbackTab = target.kind === 'shell' ? target.tab : undefined;
	state.requestedReplace = true;
	return Promise.resolve(
		deps.goto(appRouteHref(target.kind === 'shell' ? '/' : target.href), { replace: true })
	)
		.catch(() => {
			/* Router keeps the previous page on canceled/failed navigation. */
		})
		.finally(() => {
			state.backPending = false;
			state.requestedReplace = false;
			state.pendingFallbackTab = undefined;
			state.intent = undefined;
		});
}

/** True when the resolved back target is a shell route (edge-swipe preview only). */
export function backTargetIsShell(): boolean {
	if (!deps) return false;
	const fallback = state.fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback);
	const plan = resolveBack(getNavigationSnapshot(), fallback);
	if (plan.type === 'fallback') return plan.fallback.kind === 'shell';
	const target = getNavigationSnapshot().records.find((frame) => frame.id === plan.targetId);
	return target?.kind === 'route' && isShellRoute(target.href.split(/[?#]/)[0]);
}

/**
 * Check whether system-level back will be consumed by Chronos.
 * Returns true if an overlay or secondary route is active, or if navigation is pending.
 * Returns false if already on a clean root shell view.
 */
export function canSystemBack(): boolean {
	if (!deps || !state.ready) return false;
	if (state.backPending || state.intent) return true;

	const snapshot = getNavigationSnapshot();
	const current = getTopFrame();
	if (!current) return false;

	const fallback = state.fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback);
	const plan = resolveBack(snapshot, fallback);

	if (plan.type === 'traverse') {
		return true;
	}

	const pathname = deps.getPage().url.pathname;
	const isAtRootShell =
		isShellRoute(pathname) && current.kind === 'route' && current.entry !== 'deeplink';

	return !isAtRootShell;
}

/**
 * Dispatch system-level back intention (e.g. Android hardware back, keyboard ESC, or system gesture).
 * Returns 'consumed' if an overlay was dismissed or a secondary route was popped.
 * Returns 'exit' if already on a root shell view.
 */
export function dispatchSystemBack(): 'consumed' | 'exit' {
	if (!canSystemBack()) return 'exit';
	if (!state.backPending && !state.intent) navigateBack();
	return 'consumed';
}

export function stageShellTabDeparture(tabId: string): void {
	state.departureTab = tabId;
}
/** Preserve the source and direction when a shallow traversal needs a full route render. */
export function getPendingTraversal(): { from: string; delta: number } | undefined {
	const source = getTopRoute();
	const current = getTopFrame();
	if (!state.renderingTarget || !source || !current) return;
	return {
		from: source.href.split(/[?#]/)[0],
		delta: state.renderingTarget.position - current.position
	};
}
export function onBeforeNavigate(navigation: BeforeNavigate): void {
	if (navigation.willUnload || !navigation.to) {
		state.intent = undefined;
		return;
	}
	if (navigation.type === 'popstate') state.renderingTarget = undefined;
	const staged = {
		type: navigation.type,
		replace: state.requestedReplace,
		shellTab: state.departureTab
	};
	state.departureTab = undefined;
	state.intent = staged;
	void navigation.complete?.catch(() => {
		if (state.intent !== staged) return;
		state.intent = undefined;
		state.backPending = false;
		state.correctingFrom = undefined;
	});
}
/** Called after successful route navigation AND when public page.state changes (shallow routing). */
export function syncNavigationPage(completed = false): void {
	if (!deps || (!state.ready && !completed)) return;
	const page = deps.getPage();
	if (!state.ready) {
		state.ready = true;
		initNavStack(href(page.url), !isShellRoute(page.url.pathname));
		writeMarker(getTopFrame()!);
		state.completeInitialization?.();
		state.completeInitialization = undefined;
		state.intent = undefined;
		return;
	}
	if (!completed && state.intent) return;
	const actual = state.renderingTarget ?? findRecord(page.state.chronosNavigation);
	const current = getTopFrame()!;
	// A completed goto creates/replaces a browser entry even when URL is identical.
	if (completed && state.intent && state.intent.type !== 'popstate' && !state.renderingTarget) {
		const replace = state.intent.replace;
		if (state.intent.shellTab && getTopRoute()) getTopRoute()!.shellTab = state.intent.shellTab;
		state.intent = undefined;
		invalidateOverlays(() => true);
		const frame = pushRoute(href(page.url), replace);
		if (state.backPending) frame.entry = 'normal';
		if (state.pendingFallbackTab) frame.shellTab = state.pendingFallbackTab;
		writeMarker(frame);
		if (isShellRoute(page.url.pathname) && frame.shellTab) deps.setActiveTab(frame.shellTab);
		state.backPending = false;
		return;
	}
	if (actual && actual.id !== current.id) {
		const targetId = resolveTraversal(getNavigationSnapshot(), actual.id);
		const target = getNavigationSnapshot().records.find((frame) => frame.id === targetId);
		if (target && target.id !== actual.id) {
			// The original traversal has completed; no cancel/restore race with SvelteKit.
			if (state.correctingFrom !== actual.id) {
				state.correctingFrom = actual.id;
				state.backPending = true;
				deps.historyGo(target.position - actual.position);
			}
			return;
		}
		if (!completed && actual.kind === 'route' && actual.href !== getTopRoute()?.href) {
			// A route replacing a shallow entry may later be traversed shallowly by the router.
			// The public state identifies the target, but its page component still needs loading.
			state.renderingTarget = actual;
			state.backPending = true;
			void Promise.resolve(deps.goto(actual.href, { replace: true })).catch(() => {
				if (state.renderingTarget !== actual) return;
				state.renderingTarget = undefined;
				state.intent = undefined;
				deps?.historyGo(current.position - actual.position);
			});
			return;
		}

		invalidateOverlays(
			(frame) => frame.position > actual.position && frame.position <= current.position
		);

		if (state.intent?.shellTab && getTopRoute()) getTopRoute()!.shellTab = state.intent.shellTab;

		const departingRoute = getTopRoute();
		moveToRecord(actual);
		if (state.renderingTarget) {
			state.renderingTarget = undefined;
			writeMarker(actual);
		}
		state.correctingFrom = undefined;
		if (
			actual.kind === 'route' &&
			actual.id !== departingRoute?.id &&
			isShellRoute(page.url.pathname) &&
			actual.shellTab
		)
			deps.setActiveTab(actual.shellTab);
		state.backPending = false;
		state.intent = undefined;
	} else if (actual?.id === current.id) {
		// Includes returning to the original valid position after a forward tombstone.
		state.correctingFrom = undefined;
		state.backPending = false;
		if (completed) state.intent = undefined;
	} else if (completed) {
		// Unknown document/session: learn only the current entry, never history.length.
		invalidateOverlays(() => true);
		initNavStack(href(page.url), !isShellRoute(page.url.pathname));
		writeMarker(getTopFrame()!);
		state.backPending = false;
		state.intent = undefined;
	}
}
export function onAfterNavigate(): void {
	syncNavigationPage(true);
	for (const resolve of navigationCompletionWaiters) resolve();
	navigationCompletionWaiters.clear();
}
export function openOverlayHistory(
	overlayId: string,
	onDismiss: () => void
): { close(): void; dispose(): void } {
	if (!deps) return { close() {}, dispose() {} };
	if (!state.ready) {
		let canceled = false;
		let handle: { close(): void; dispose(): void } | undefined;
		void state.whenReady.then(() => {
			if (!canceled) handle = openOverlayHistory(overlayId, onDismiss);
		});
		return {
			close() {
				canceled = true;
				handle?.close();
			},
			dispose() {
				canceled = true;
				handle?.dispose();
			}
		};
	}
	const frame = pushOverlay(overlayId, onDismiss);
	deps.pushState('', { ...deps.getPage().state, chronosNavigation: markerFor(frame) });
	function remove(): void {
		if (!frame.valid) return;
		invalidateOverlays((candidate) => candidate.id === frame.id);
		const current = getTopFrame();
		if (current?.kind === 'overlay' && !current.valid && !state.backPending && !state.intent)
			navigateBack();
	}
	return { close: remove, dispose: remove };
}
