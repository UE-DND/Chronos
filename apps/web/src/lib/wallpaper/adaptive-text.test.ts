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
});
