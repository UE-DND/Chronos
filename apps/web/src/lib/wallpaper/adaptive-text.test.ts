import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { observeAdaptiveWallpaperText } from './adaptive-text';

afterEach(() => vi.unstubAllGlobals());

describe('adaptive wallpaper text observer', () => {
	it('batches geometry reads before tone writes and reuses targets until their membership changes', () => {
		const operations: string[] = [];
		let targets: HTMLElement[] = [];
		let onMutations: (records: MutationRecord[]) => void = () => {};
		let frame: FrameRequestCallback | undefined;
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
			frame = callback;
			return 1;
		});
		vi.stubGlobal('cancelAnimationFrame', () => {});
		vi.stubGlobal(
			'MutationObserver',
			class {
				constructor(callback: (records: MutationRecord[]) => void) {
					onMutations = callback;
				}
				observe() {}
				disconnect() {}
			}
		);
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				disconnect() {}
			}
		);
		vi.stubGlobal('window', new EventTarget());

		function target(label: string, top: number): HTMLElement {
			return {
				dataset: new Proxy({} as DOMStringMap, {
					set(object, key, value) {
						operations.push(`write:${label}`);
						return Reflect.set(object, key, value);
					},
					deleteProperty(object, key) {
						operations.push(`clear:${label}`);
						return Reflect.deleteProperty(object, key);
					}
				}),
				getBoundingClientRect() {
					operations.push(`read:${label}`);
					return { left: 0, top, right: 50, bottom: top + 20, width: 50, height: 20 };
				},
				closest: () => null
			} as unknown as HTMLElement;
		}
		const first = target('first', 0);
		const second = target('second', 30);
		targets = [first, second];
		const wallpaper = {
			getBoundingClientRect: () => ({
				left: 0,
				top: 0,
				right: 100,
				bottom: 100,
				width: 100,
				height: 100
			})
		} as HTMLElement;
		const querySelectorAll = vi.fn(() => targets);
		const container = Object.assign(new EventTarget(), {
			closest: () => ({ querySelector: () => wallpaper }),
			querySelectorAll
		}) as unknown as HTMLElement;
		const stop = observeAdaptiveWallpaperText(
			container,
			{ pixels: new Uint8ClampedArray([255, 255, 255, 255]), width: 1, height: 1 },
			false
		);
		frame?.(0);
		expect(operations).toEqual(['read:first', 'read:second', 'write:first', 'write:second']);
		expect(querySelectorAll).toHaveBeenCalledTimes(1);

		operations.length = 0;
		container.dispatchEvent(new Event('scroll'));
		frame?.(1);
		expect(operations).toEqual(['read:first', 'read:second']);
		expect(querySelectorAll).toHaveBeenCalledTimes(1);

		const third = target('third', 60);
		targets = [first, third];
		operations.length = 0;
		onMutations([{ type: 'childList' } as MutationRecord]);
		frame?.(2);
		expect(querySelectorAll).toHaveBeenCalledTimes(2);
		expect(operations).toEqual(['read:first', 'read:third', 'clear:second', 'write:third']);
		stop();
	});
	it('samples the local transformed image and resamples on movement, then clears tones on disposal', () => {
		let frame: FrameRequestCallback | undefined;
		let onMutations!: MutationCallback;
		vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
			frame = callback;
			return 1;
		});
		vi.stubGlobal('cancelAnimationFrame', vi.fn());
		const disconnect = vi.fn();
		vi.stubGlobal(
			'MutationObserver',
			class {
				constructor(callback: MutationCallback) {
					onMutations = callback;
				}
				observe() {}
				disconnect = disconnect;
			}
		);
		vi.stubGlobal(
			'ResizeObserver',
			class {
				observe() {}
				disconnect = disconnect;
			}
		);
		vi.stubGlobal('window', new EventTarget());
		const viewport = { left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100 };
		let left = 0;
		const image = {
			getBoundingClientRect: () => ({ ...viewport, left, right: left + 200, width: 200 })
		} as HTMLImageElement;
		const text = {
			dataset: {},
			closest: () => null,
			getBoundingClientRect: () => ({
				left: 10,
				top: 10,
				right: 30,
				bottom: 30,
				width: 20,
				height: 20
			})
		} as unknown as HTMLElement;
		const container = Object.assign(new EventTarget(), {
			closest: () => {
				throw new Error('must not sample shell background');
			},
			getBoundingClientRect: () => viewport,
			querySelectorAll: () => [text]
		}) as unknown as HTMLElement;
		const stop = observeAdaptiveWallpaperText(
			container,
			{
				pixels: new Uint8ClampedArray([0, 0, 0, 255, 255, 255, 255, 255]),
				width: 2,
				height: 1
			},
			false,
			{ wallpaper: container, image }
		);
		frame?.(0);
		expect(text.dataset.adaptiveTone).toBe('light');
		left = -100;
		onMutations(
			[{ type: 'attributes', attributeName: 'style' } as MutationRecord],
			{} as MutationObserver
		);
		frame?.(1);
		expect(text.dataset.adaptiveTone).toBe('dark');
		stop();
		expect(text.dataset.adaptiveTone).toBeUndefined();
		expect(disconnect).toHaveBeenCalledTimes(2);
	});
});
