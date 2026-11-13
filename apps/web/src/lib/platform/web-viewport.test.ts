import { afterEach, expect, it, vi } from 'vite-plus/test';
import { installWebViewportLayout } from './web-viewport';

afterEach(() => vi.unstubAllGlobals());

it('tracks keyboard resizing and panning, preserves zoomed layout, restores and releases listeners', () => {
	const values = new Map<string, string>();
	const viewport = Object.assign(new EventTarget(), { height: 932, offsetTop: 0, scale: 1 });
	const win = Object.assign(new EventTarget(), { visualViewport: viewport, innerHeight: 932 });
	vi.stubGlobal('window', win);
	vi.stubGlobal('document', {
		documentElement: {
			style: {
				setProperty: (name: string, value: string) => values.set(name, value),
				removeProperty: (name: string) => values.delete(name)
			}
		}
	});
	const dispose = installWebViewportLayout();
	viewport.height = 420;
	viewport.dispatchEvent(new Event('resize'));
	expect(values.get('--app-viewport-height')).toBe('420px');
	expect(values.get('--app-viewport-bottom')).toBe('512px');
	viewport.offsetTop = 80;
	viewport.dispatchEvent(new Event('scroll'));
	expect(values.get('--app-viewport-top')).toBe('80px');
	expect(values.get('--app-viewport-bottom')).toBe('432px');
	viewport.scale = 2;
	viewport.height = 210;
	viewport.dispatchEvent(new Event('resize'));
	expect(values.get('--app-viewport-height')).toBe('420px');
	Object.assign(viewport, { height: 932, offsetTop: 0, scale: 1 });
	viewport.dispatchEvent(new Event('resize'));
	expect(Array.from(values.values())).toEqual(['932px', '0px', '0px']);
	viewport.height = 430;
	win.innerHeight = 430;
	win.dispatchEvent(new Event('resize'));
	expect(values.get('--app-viewport-height')).toBe('430px');
	expect(values.get('--app-viewport-bottom')).toBe('0px');
	dispose();
	viewport.dispatchEvent(new Event('resize'));
	viewport.dispatchEvent(new Event('scroll'));
	win.dispatchEvent(new Event('resize'));
	expect(values.size).toBe(0);
});

it('keeps CSS viewport sizing when VisualViewport is unavailable', () => {
	vi.stubGlobal('window', { visualViewport: undefined });
	expect(() => installWebViewportLayout()()).not.toThrow();
});
