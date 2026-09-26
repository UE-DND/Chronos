import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { CHRONOS_NATIVE_BRIDGE_KEY } from '../src/platform/native-bridge';
import { readClipboardText, writeClipboardText } from '../src/platform/clipboard';

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('platform/clipboard', () => {
	describe('readClipboardText', () => {
		it('prioritizes native bridge when available', async () => {
			const mockCallNative = vi.fn().mockResolvedValue('native text');
			const mockWindow = {
				[CHRONOS_NATIVE_BRIDGE_KEY]: {
					callNative: mockCallNative
				}
			};
			vi.stubGlobal('window', mockWindow);

			const text = await readClipboardText();
			expect(mockCallNative).toHaveBeenCalledWith('clipboard', 'readText');
			expect(text).toBe('native text');
		});

		it('falls back to navigator.clipboard when native bridge fails', async () => {
			const mockCallNative = vi.fn().mockRejectedValue(new Error('native fail'));
			const mockWindow = {
				[CHRONOS_NATIVE_BRIDGE_KEY]: {
					callNative: mockCallNative
				}
			};
			vi.stubGlobal('window', mockWindow);

			const mockReadText = vi.fn().mockResolvedValue('web text');
			vi.stubGlobal('navigator', {
				clipboard: { readText: mockReadText }
			});

			const text = await readClipboardText();
			expect(mockReadText).toHaveBeenCalled();
			expect(text).toBe('web text');
		});

		it('falls back to navigator.clipboard when native bridge is absent', async () => {
			vi.stubGlobal('window', {});
			const mockReadText = vi.fn().mockResolvedValue('web text only');
			vi.stubGlobal('navigator', {
				clipboard: { readText: mockReadText }
			});

			const text = await readClipboardText();
			expect(text).toBe('web text only');
		});

		it('rejects when no clipboard reader is available', async () => {
			vi.stubGlobal('window', {});
			vi.stubGlobal('navigator', {});

			await expect(readClipboardText()).rejects.toThrow('Clipboard read is not supported');
		});
	});

	describe('writeClipboardText', () => {
		it('prioritizes native bridge when available', async () => {
			const mockCallNative = vi.fn().mockResolvedValue(undefined);
			const mockWindow = {
				[CHRONOS_NATIVE_BRIDGE_KEY]: {
					callNative: mockCallNative
				}
			};
			vi.stubGlobal('window', mockWindow);

			const ok = await writeClipboardText('hello');
			expect(mockCallNative).toHaveBeenCalledWith('clipboard', 'writeText', { text: 'hello' });
			expect(ok).toBe(true);
		});

		it('falls back to navigator.clipboard when native bridge fails', async () => {
			const mockCallNative = vi.fn().mockRejectedValue(new Error('bridge fail'));
			const mockWindow = {
				[CHRONOS_NATIVE_BRIDGE_KEY]: {
					callNative: mockCallNative
				}
			};
			vi.stubGlobal('window', mockWindow);

			const mockWriteText = vi.fn().mockResolvedValue(undefined);
			vi.stubGlobal('navigator', {
				clipboard: { writeText: mockWriteText }
			});

			const ok = await writeClipboardText('hello web');
			expect(mockWriteText).toHaveBeenCalledWith('hello web');
			expect(ok).toBe(true);
		});
	});
});
