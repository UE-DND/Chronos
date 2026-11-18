import type { BeforeNavigate } from '$app/navigation';
import { resolveBack, resolveTraversal, type BackFallback, type BackPlan } from './back-resolver';
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
	type NavigationSnapshot,
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
	pendingHistoryGo?: { sourceId?: string; timer?: ReturnType<typeof setTimeout> };
	pendingFallbackToken?: symbol;
	failedOverlayPopId?: string;
}

const HISTORY_GO_TIMEOUT_MS = 300;

function clearPendingHistoryGo(targetState: CoordinatorState): void {
	if (!targetState.pendingHistoryGo) return;
	if (targetState.pendingHistoryGo.timer !== undefined) {
		clearTimeout(targetState.pendingHistoryGo.timer);
	}
	targetState.pendingHistoryGo = undefined;
}

function resetPendingBackState(targetState: CoordinatorState): void {
	clearPendingHistoryGo(targetState);
	targetState.backPending = false;
	targetState.pendingFallbackToken = undefined;
	targetState.requestedReplace = false;
	targetState.pendingFallbackTab = undefined;
	targetState.intent = undefined;
	targetState.correctingFrom = undefined;
}

function runGoto(hrefTarget: string, opts?: { replace?: boolean }): Promise<void> {
	if (!deps) return Promise.resolve();
	try {
		return Promise.resolve(deps.goto(hrefTarget, opts));
	} catch (error) {
		return Promise.reject(error);
	}
}

function runHistoryGo(
	targetState: CoordinatorState,
	delta: number,
	onNoNavigation: (reason: 'error' | 'timeout') => void
): void {
	if (!deps || state !== targetState) return;
	clearPendingHistoryGo(targetState);
	const pending: NonNullable<CoordinatorState['pendingHistoryGo']> = {
		sourceId: findRecord(deps.getPage().state.chronosNavigation)?.id
	};
	targetState.pendingHistoryGo = pending;
	try {
		deps.historyGo(delta);
	} catch {
		if (state !== targetState || targetState.pendingHistoryGo !== pending) return;
		clearPendingHistoryGo(targetState);
		onNoNavigation('error');
		return;
	}
	if (state !== targetState || targetState.pendingHistoryGo !== pending) return;
	pending.timer = setTimeout(() => {
		if (state !== targetState || targetState.pendingHistoryGo !== pending) return;
		clearPendingHistoryGo(targetState);
		onNoNavigation('timeout');
	}, HISTORY_GO_TIMEOUT_MS);
}

function runFallbackBack(activeState: CoordinatorState, target: BackFallback): void {
	if (!deps || state !== activeState) return;
	const fallbackToken = Symbol('fallbackBack');
	activeState.backPending = true;
	activeState.pendingFallbackToken = fallbackToken;
	activeState.pendingFallbackTab = target.kind === 'shell' ? target.tab : undefined;
	activeState.requestedReplace = true;
	void runGoto(appRouteHref(target.kind === 'shell' ? '/' : target.href), { replace: true })
		.catch(() => {
			/* Router keeps the previous page on canceled/failed navigation. */
		})
		.finally(() => {
			if (state === activeState && activeState.pendingFallbackToken === fallbackToken) {
				resetPendingBackState(activeState);
			}
		});
}

function resolveLogicalBack(
	snapshot: NavigationSnapshot,
	fallback: BackFallback,
	failedOverlayPopId?: string
): { logicalFrame: Readonly<NavFrame> | undefined; plan: BackPlan } {
	const current = snapshot.records[snapshot.cursor];
	if (
		current &&
		current.kind === 'overlay' &&
		!current.valid &&
		current.id === failedOverlayPopId
	) {
		for (let i = snapshot.cursor - 1; i >= 0; i--) {
			const candidate = snapshot.records[i];
			if (candidate.kind === 'route' || candidate.valid) {
				const plan = resolveBack({ records: snapshot.records, cursor: i }, fallback);
				if (plan.type === 'traverse') {
					const target = snapshot.records.find((frame) => frame.id === plan.targetId);
					if (target) {
						return {
							logicalFrame: candidate,
							plan: { ...plan, delta: target.position - current.position }
						};
					}
				}
				return { logicalFrame: candidate, plan };
			}
		}
	}
	return { logicalFrame: current, plan: resolveBack(snapshot, fallback) };
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
	clearPendingHistoryGo(state);
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
	if (!deps || state.backPending) return;
	const activeState = state;
	const topFrame = getTopFrame();
	const { logicalFrame, plan } = resolveLogicalBack(
		getNavigationSnapshot(),
		fallback,
		activeState.failedOverlayPopId
	);
	activeState.backPending = true;
	if (
		plan.type === 'traverse' &&
		findRecord(deps.getPage().state.chronosNavigation)?.id === topFrame?.id
	) {
		runHistoryGo(activeState, plan.delta, (reason) => {
			resetPendingBackState(activeState);
			const current = getTopFrame();
			// A timeout cannot cancel a browser traversal that is still queued.
			if (logicalFrame?.kind === 'route' && reason === 'error') {
				runFallbackBack(activeState, fallback);
			} else if (current?.kind === 'overlay' && !current.valid) {
				activeState.failedOverlayPopId = current.id;
			}
		});
		return;
	}
	const target = plan.type === 'fallback' ? plan.fallback : fallback;
	runFallbackBack(activeState, target);
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
	const fallback = state.fallbackRegistration?.fallback ?? ({ kind: 'shell' } as BackFallback);
	const { logicalFrame, plan } = resolveLogicalBack(snapshot, fallback, state.failedOverlayPopId);
	if (!logicalFrame) return false;

	if (plan.type === 'traverse') {
		return true;
	}

	const pathname = deps.getPage().url.pathname;
	const isAtRootShell =
		isShellRoute(pathname) && logicalFrame.kind === 'route' && logicalFrame.entry !== 'deeplink';

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
	clearPendingHistoryGo(state);
	if (navigation.type === 'popstate') state.renderingTarget = undefined;
	const activeState = state;
	const staged = {
		type: navigation.type,
		replace: activeState.requestedReplace,
		shellTab: activeState.departureTab
	};
	activeState.departureTab = undefined;
	activeState.intent = staged;
	void navigation.complete?.catch(() => {
		if (state !== activeState || activeState.intent !== staged) return;
		resetPendingBackState(activeState);
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
		clearPendingHistoryGo(state);
		state.failedOverlayPopId = undefined;
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
		state.requestedReplace = false;
		state.pendingFallbackTab = undefined;
		state.pendingFallbackToken = undefined;
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
				const activeState = state;
				runHistoryGo(activeState, target.position - actual.position, () => {
					resetPendingBackState(activeState);
				});
			}
			return;
		}
		if (!completed && actual.kind === 'route' && actual.href !== getTopRoute()?.href) {
			// A route replacing a shallow entry may later be traversed shallowly by the router.
			// The public state identifies the target, but its page component still needs loading.
			clearPendingHistoryGo(state);
			state.renderingTarget = actual;
			state.backPending = true;
			const activeState = state;
			void runGoto(actual.href, { replace: true }).catch(() => {
				if (state !== activeState || activeState.renderingTarget !== actual) return;
				activeState.renderingTarget = undefined;
				activeState.intent = undefined;
				activeState.backPending = true;
				runHistoryGo(activeState, current.position - actual.position, () => {
					resetPendingBackState(activeState);
				});
			});
			return;
		}

		clearPendingHistoryGo(state);
		state.failedOverlayPopId = undefined;
		state.pendingFallbackToken = undefined;
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
		// Refreshing state on the physical source entry does not acknowledge a traversal.
		if (!completed && state.pendingHistoryGo?.sourceId === actual?.id) return;
		// Includes returning to the original valid position after a forward tombstone.
		clearPendingHistoryGo(state);
		state.correctingFrom = undefined;
		state.backPending = false;
		if (completed) state.intent = undefined;
	} else if (completed) {
		// Unknown document/session: learn only the current entry, never history.length.
		clearPendingHistoryGo(state);
		state.failedOverlayPopId = undefined;
		state.pendingFallbackToken = undefined;
		invalidateOverlays(() => true);
		initNavStack(href(page.url), !isShellRoute(page.url.pathname));
		writeMarker(getTopFrame()!);
		state.backPending = false;
		state.intent = undefined;
	}
}
export function onAfterNavigate(): void {
	syncNavigationPage(true);
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
	state.failedOverlayPopId = undefined;
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
