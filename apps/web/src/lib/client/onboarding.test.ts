import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test';
import {
	hasSeenOnboarding,
	ONBOARDING_STEPS,
	OnboardingController,
	type OnboardingStepId
} from './onboarding.svelte';

describe('OnboardingController', () => {
	let storage = new Map<string, string>();
	let controller: OnboardingController;

	beforeEach(() => {
		storage = new Map<string, string>();
		vi.stubGlobal('window', {});
		vi.stubGlobal('localStorage', {
			getItem: (key: string) => storage.get(key) ?? null,
			setItem: (key: string, value: string) => {
				storage.set(key, value);
			},
			removeItem: (key: string) => {
				storage.delete(key);
			},
			clear: () => {
				storage.clear();
			}
		});
		controller = new OnboardingController();
	});

	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('defines the complete ordered flow with semantic step IDs', () => {
		expect(ONBOARDING_STEPS).toEqual([
			'welcome',
			'legal',
			'highlights',
			'install',
			'layout',
			'longPress',
			'done'
		]);
		expect(controller.state.stepCount).toBe(ONBOARDING_STEPS.length);
	});

	describe('isActive', () => {
		it('activates early on shell routes before the engine check for new users', () => {
			expect(controller.state.open).toBe(false);
			expect(controller.isActive('/')).toBe(true);
		});

		it('stays inactive when onboarding was already seen', () => {
			storage.set('chronos:onboarding-seen', '1');
			expect(controller.isActive('/')).toBe(false);
		});

		it('stays active on a shell route when explicitly opened', () => {
			controller.openAt('welcome');
			expect(controller.isActive('/')).toBe(true);
		});

		it('is inactive on legal routes while remaining open for the return trip', () => {
			controller.openAt('legal');
			expect(controller.isActive('/legal/terms')).toBe(false);
			expect(controller.isActive('/legal/privacy')).toBe(false);
			expect(controller.state.open).toBe(true);
		});

		it('closes after startup when the user already has a timetable', () => {
			controller.maybeShow(true);
			expect(controller.isActive('/')).toBe(false);
			expect(controller.state.open).toBe(false);
		});
	});

	describe('shouldRender', () => {
		it('renders the overlay on legal routes while it is open', () => {
			controller.openAt('legal');
			expect(controller.shouldRender('/legal/terms')).toBe(true);
		});

		it('does not render after startup dismisses onboarding', () => {
			controller.maybeShow(true);
			expect(controller.shouldRender('/')).toBe(false);
		});
	});

	describe('maybeShow', () => {
		it('opens at the welcome step for a new user without a timetable', () => {
			controller.maybeShow(false);
			expect(controller.state).toEqual({
				open: true,
				currentStepId: 'welcome',
				stepIndex: 0,
				stepCount: 7,
				canGoBack: false,
				isLastStep: false
			});
		});

		it('keeps onboarding closed for returning users with a timetable', () => {
			controller.maybeShow(true);
			expect(controller.state.open).toBe(false);
		});

		it('checks startup eligibility only once', () => {
			controller.maybeShow(true);
			controller.maybeShow(false);
			expect(controller.state.open).toBe(false);
		});
	});

	describe('step navigation', () => {
		it('updates the semantic step and complete progress summary', () => {
			controller.openAt('highlights');
			expect(controller.state).toMatchObject({
				open: true,
				currentStepId: 'highlights',
				stepIndex: 2,
				stepCount: 7,
				canGoBack: true,
				isLastStep: false
			});

			controller.next();
			expect(controller.state.currentStepId).toBe('install');
			expect(controller.state.stepIndex).toBe(3);
			controller.back();
			expect(controller.state.currentStepId).toBe('highlights');
		});

		it('keeps navigation within the first and last steps', () => {
			controller.back();
			expect(controller.state.currentStepId).toBe('welcome');
			expect(controller.state.canGoBack).toBe(false);

			controller.openAt('done');
			expect(controller.state).toMatchObject({
				currentStepId: 'done',
				stepIndex: 6,
				canGoBack: true,
				isLastStep: true
			});
			controller.next();
			expect(controller.state.currentStepId).toBe('done');
		});

		it('ignores an invalid runtime step ID without changing state', () => {
			controller.openAt('highlights');
			const before = controller.state;
			controller.openAt('unknown' as OnboardingStepId);
			expect(controller.state).toEqual(before);
		});
	});

	describe('finish', () => {
		it('persists the seen marker and closes onboarding', () => {
			controller.openAt('done');
			controller.finish();
			expect(controller.state.open).toBe(false);
			expect(storage.get('chronos:onboarding-seen')).toBe('1');
			expect(controller.isActive('/')).toBe(false);
		});

		it('still closes for the current session when storage is unavailable', () => {
			vi.stubGlobal('localStorage', {
				getItem: () => {
					throw new Error('Storage denied');
				},
				setItem: () => {
					throw new Error('Storage denied');
				}
			});

			expect(hasSeenOnboarding()).toBe(false);
			controller.openAt('welcome');
			expect(() => controller.finish()).not.toThrow();
			expect(controller.state.open).toBe(false);
			expect(controller.isActive('/')).toBe(false);
		});
	});

	describe('native platform', () => {
		it('omits the install step when in native platform', async () => {
			const { setHostPlatform, resetHostPlatform } = await import('$lib/platform/host-platform');
			setHostPlatform({
				id: 'mobile',
				platformType: 'android',
				isNative: true,
				supportsPwaInstall: false,
				shouldShowInstallGuide: false
			});
			const nativeController = new OnboardingController();

			expect(nativeController.state.stepCount).toBe(ONBOARDING_STEPS.length - 1);
			nativeController.openAt('highlights');
			nativeController.next();
			expect(nativeController.state.currentStepId).toBe('layout');
			nativeController.back();
			expect(nativeController.state.currentStepId).toBe('highlights');
			resetHostPlatform();
		});
	});
});
