import { isShellRoute } from '$lib/navigation/routes';

const SEEN_KEY = 'chronos:onboarding-seen';

export const ONBOARDING_STEPS = [
	'welcome',
	'legal',
	'highlights',
	'install',
	'layout',
	'longPress',
	'done'
] as const;

export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

export interface OnboardingState {
	readonly open: boolean;
	readonly currentStepId: OnboardingStepId;
	readonly stepIndex: number;
	readonly stepCount: number;
	readonly canGoBack: boolean;
	readonly isLastStep: boolean;
}

export function hasSeenOnboarding(): boolean {
	if (typeof window === 'undefined') return true;
	try {
		return localStorage.getItem(SEEN_KEY) === '1';
	} catch {
		return false;
	}
}

/** First-launch onboarding: welcome → legal → highlights → install → display style → long press → CTA. */
export class OnboardingController {
	private isOpen = $state(false);
	private currentStepId = $state<OnboardingStepId>(ONBOARDING_STEPS[0]);

	private hasChecked = false;

	get state(): OnboardingState {
		const stepIndex = ONBOARDING_STEPS.indexOf(this.currentStepId);
		return {
			open: this.isOpen,
			currentStepId: this.currentStepId,
			stepIndex,
			stepCount: ONBOARDING_STEPS.length,
			canGoBack: stepIndex > 0,
			isLastStep: stepIndex === ONBOARDING_STEPS.length - 1
		};
	}

	isActive(pathname: string): boolean {
		if (!isShellRoute(pathname)) return false;
		if (this.isOpen) return true;
		if (typeof window === 'undefined') return false;
		return !this.hasChecked && !hasSeenOnboarding();
	}

	shouldRender(pathname: string): boolean {
		return this.isOpen || this.isActive(pathname);
	}

	/** Called once app state has finished loading; shows onboarding for new users only. */
	maybeShow(hasTimetable: boolean) {
		if (this.hasChecked || typeof window === 'undefined') return;
		this.hasChecked = true;

		if (hasTimetable || hasSeenOnboarding()) {
			this.isOpen = false;
			return;
		}

		this.currentStepId = ONBOARDING_STEPS[0];
		this.isOpen = true;
	}

	/** Reopens the flow at a specific step, e.g. from the empty state's import guide link. */
	openAt(stepId: OnboardingStepId) {
		if (!(ONBOARDING_STEPS as readonly string[]).includes(stepId)) return;
		this.currentStepId = stepId;
		this.isOpen = true;
	}

	next() {
		const stepIndex = ONBOARDING_STEPS.indexOf(this.currentStepId);
		const nextStepId = ONBOARDING_STEPS[stepIndex + 1];
		if (nextStepId) this.currentStepId = nextStepId;
	}

	back() {
		const stepIndex = ONBOARDING_STEPS.indexOf(this.currentStepId);
		const previousStepId = ONBOARDING_STEPS[stepIndex - 1];
		if (previousStepId) this.currentStepId = previousStepId;
	}

	finish() {
		this.isOpen = false;
		this.hasChecked = true;
		if (typeof window !== 'undefined') {
			try {
				localStorage.setItem(SEEN_KEY, '1');
			} catch {
				// Storage can be denied; keep onboarding closed for this session.
			}
		}
	}
}

export const onboardingController = new OnboardingController();
