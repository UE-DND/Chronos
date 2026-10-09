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
let ready = false;
let whenReady: Promise<void>;
let completeInitialization: (() => void) | undefined;
let renderingTarget: NavFrame | undefined;
let intent: { type: string; replace: boolean; shellTab?: string } | undefined;
let departureTab: string | undefined;
let requestedReplace = false;
let requestId = 0;
let backPending = false;
let correctingFrom: string | undefined;
let fallbackRegistration: { fallback: BackFallback } | undefined;
let pendingFallbackTab: string | undefined;
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
	ready = false;
	whenReady = new Promise((resolve) => {
		completeInitialization = resolve;
	});
	departureTab = undefined;
	++requestId;
	renderingTarget = undefined;
	correctingFrom = undefined;
	deps = next;
	intent = undefined;
	requestedReplace = false;
	backPending = false;
	fallbackRegistration = undefined;
}
export function registerPageBackFallback(fallback: BackFallback): () => void {
	const registration = { fallback };
	fallbackRegistration = registration;
	return () => {
		if (fallbackRegistration === registration) fallbackRegistration = undefined;
	};
}
export async function navigateForward(
	url: string,
	opts: { replace?: boolean } = {}
): Promise<void> {
	if (!deps || backPending) return;
	const request = ++requestId;
	requestedReplace = opts.replace ?? getTopFrame()?.kind === 'overlay';
	try {
		await deps.goto(appRouteHref(url), { replace: requestedReplace });
	} finally {
		if (request === requestId) {
			requestedReplace = false;
			intent = undefined;
		}
	}
}
export function navigateBack(
	fallback = fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback)
): void {
	void performNavigateBack(fallback);
}

/** Navigate back and resolve after SvelteKit commits the destination route. */
export function navigateBackAndWait(
	fallback = fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback)
): Promise<void> {
	return performNavigateBack(fallback);
}

function performNavigateBack(fallback: BackFallback): Promise<void> {
	if (!deps || backPending) return Promise.resolve();
	const plan = resolveBack(getNavigationSnapshot(), fallback);
	backPending = true;
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
	pendingFallbackTab = target.kind === 'shell' ? target.tab : undefined;
	requestedReplace = true;
	return Promise.resolve(
		deps.goto(appRouteHref(target.kind === 'shell' ? '/' : target.href), { replace: true })
	)
		.catch(() => {
			/* Router keeps the previous page on canceled/failed navigation. */
		})
		.finally(() => {
			backPending = false;
			requestedReplace = false;
			pendingFallbackTab = undefined;
			intent = undefined;
		});
}

/** True when the resolved back target is a shell route (edge-swipe preview only). */
export function backTargetIsShell(): boolean {
	if (!deps) return false;
	const fallback = fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback);
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
	if (!deps || !ready) return false;
	if (backPending || intent) return true;

	const snapshot = getNavigationSnapshot();
	const current = getTopFrame();
	if (!current) return false;

	const fallback = fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback);
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
	if (!deps || !ready) return 'exit';
	if (backPending || intent) return 'consumed';

	const snapshot = getNavigationSnapshot();
	const current = getTopFrame();
	if (!current) return 'exit';

	const fallback = fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback);
	const plan = resolveBack(snapshot, fallback);

	if (plan.type === 'traverse') {
		navigateBack(fallback);
		return 'consumed';
	}

	const pathname = deps.getPage().url.pathname;
	const isAtRootShell =
		isShellRoute(pathname) && current.kind === 'route' && current.entry !== 'deeplink';

	if (!isAtRootShell) {
		navigateBack(fallback);
		return 'consumed';
	}

	return 'exit';
}

export function stageShellTabDeparture(tabId: string): void {
	departureTab = tabId;
}
/** Preserve the source and direction when a shallow traversal needs a full route render. */
export function getPendingTraversal(): { from: string; delta: number } | undefined {
	const source = getTopRoute();
	const current = getTopFrame();
	if (!renderingTarget || !source || !current) return;
	return { from: source.href.split(/[?#]/)[0], delta: renderingTarget.position - current.position };
}
export function onBeforeNavigate(navigation: BeforeNavigate): void {
	if (navigation.willUnload || !navigation.to) {
		intent = undefined;
		return;
	}
	if (navigation.type === 'popstate') renderingTarget = undefined;
	const staged = { type: navigation.type, replace: requestedReplace, shellTab: departureTab };
	departureTab = undefined;
	intent = staged;
	void navigation.complete?.catch(() => {
		if (intent !== staged) return;
		intent = undefined;
		backPending = false;
		correctingFrom = undefined;
	});
}
/** Called after successful route navigation AND when public page.state changes (shallow routing). */
export function syncNavigationPage(completed = false): void {
	if (!deps || (!ready && !completed)) return;
	const page = deps.getPage();
	if (!ready) {
		ready = true;
		initNavStack(href(page.url), !isShellRoute(page.url.pathname));
		writeMarker(getTopFrame()!);
		completeInitialization?.();
		completeInitialization = undefined;
		intent = undefined;
		return;
	}
	if (!completed && intent) return;
	const actual = renderingTarget ?? findRecord(page.state.chronosNavigation);
	const current = getTopFrame()!;
	// A completed goto creates/replaces a browser entry even when URL is identical.
	if (completed && intent && intent.type !== 'popstate' && !renderingTarget) {
		const replace = intent.replace;
		if (intent.shellTab && getTopRoute()) getTopRoute()!.shellTab = intent.shellTab;
		intent = undefined;
		invalidateOverlays(() => true);
		const frame = pushRoute(href(page.url), replace);
		if (backPending) frame.entry = 'normal';
		if (pendingFallbackTab) frame.shellTab = pendingFallbackTab;
		writeMarker(frame);
		if (isShellRoute(page.url.pathname) && frame.shellTab) deps.setActiveTab(frame.shellTab);
		backPending = false;
		return;
	}
	if (actual && actual.id !== current.id) {
		const targetId = resolveTraversal(getNavigationSnapshot(), actual.id);
		const target = getNavigationSnapshot().records.find((frame) => frame.id === targetId);
		if (target && target.id !== actual.id) {
			// The original traversal has completed; no cancel/restore race with SvelteKit.
			if (correctingFrom !== actual.id) {
				correctingFrom = actual.id;
				backPending = true;
				deps.historyGo(target.position - actual.position);
			}
			return;
		}
		if (!completed && actual.kind === 'route' && actual.href !== getTopRoute()?.href) {
			// A route replacing a shallow entry may later be traversed shallowly by the router.
			// The public state identifies the target, but its page component still needs loading.
			renderingTarget = actual;
			backPending = true;
			void Promise.resolve(deps.goto(actual.href, { replace: true })).catch(() => {
				if (renderingTarget !== actual) return;
				renderingTarget = undefined;
				intent = undefined;
				deps?.historyGo(current.position - actual.position);
			});
			return;
		}

		invalidateOverlays(
			(frame) => frame.position > actual.position && frame.position <= current.position
		);

		if (intent?.shellTab && getTopRoute()) getTopRoute()!.shellTab = intent.shellTab;

		const departingRoute = getTopRoute();
		moveToRecord(actual);
		if (renderingTarget) {
			renderingTarget = undefined;
			writeMarker(actual);
		}
		correctingFrom = undefined;
		if (
			actual.kind === 'route' &&
			actual.id !== departingRoute?.id &&
			isShellRoute(page.url.pathname) &&
			actual.shellTab
		)
			deps.setActiveTab(actual.shellTab);
		backPending = false;
		intent = undefined;
	} else if (actual?.id === current.id) {
		// Includes returning to the original valid position after a forward tombstone.
		correctingFrom = undefined;
		backPending = false;
		if (completed) intent = undefined;
	} else if (completed) {
		// Unknown document/session: learn only the current entry, never history.length.
		invalidateOverlays(() => true);
		initNavStack(href(page.url), !isShellRoute(page.url.pathname));
		writeMarker(getTopFrame()!);
		backPending = false;
		intent = undefined;
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
	if (!ready) {
		let canceled = false;
		let handle: { close(): void; dispose(): void } | undefined;
		void whenReady.then(() => {
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
		if (current?.kind === 'overlay' && !current.valid && !backPending && !intent) navigateBack();
	}
	return { close: remove, dispose: remove };
}
