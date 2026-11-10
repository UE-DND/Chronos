import { afterEach, expect, it, vi } from 'vite-plus/test';
import { installIosPwaRailLayout } from './ios-pwa-rail';

afterEach(() => vi.unstubAllGlobals());

it('tracks the physical cutout side and releases its listeners on teardown', () => {
	const attributes = new Set<string>();
	const root = {
		toggleAttribute(name: string, force: boolean) {
			if (force) attributes.add(name);
			else attributes.delete(name);
		},
		removeAttribute(name: string) {
			attributes.delete(name);
		}
	};
	const orientation = new EventTarget();
	const win = Object.assign(new EventTarget(), {
		orientation: 90 as number | undefined,
		screen: { orientation }
	});
	vi.stubGlobal('window', win);
	vi.stubGlobal('document', { documentElement: root });
	const dispose = installIosPwaRailLayout();
	const compact = () => attributes.has('data-ios-pwa-left-cutout');
	expect(compact()).toBe(true);
	for (const angle of [-90, 0, 180, undefined, 90]) {
		win.orientation = angle;
		win.dispatchEvent(new Event('orientationchange'));
		expect(compact()).toBe(angle === 90);
	}
	dispose();
	expect(compact()).toBe(false);
	win.dispatchEvent(new Event('orientationchange'));
	orientation.dispatchEvent(new Event('change'));
	expect(compact()).toBe(false);
});
