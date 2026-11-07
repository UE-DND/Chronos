export * from './routes';
export {
	createNavigationPresentation,
	getNavigationPresentation,
	setNavigationPresentation
} from './navigation-presentation.svelte';
export * from './nav-coordinator';
export type { BackFallback } from './back-resolver';
export { getOverlayHistoryPort } from './overlay-history-port';
