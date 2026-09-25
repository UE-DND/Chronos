import { afterEach, describe, expect, it, vi } from 'vitest';
import { copyTextWithFallback, downloadExportResult, withTimeout } from './transfer';

describe('platform/transfer', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('downloadExportResult creates a temporary anchor in browser mode', async () => {
		const click = vi.fn();
		const removeChild = vi.fn();
		const appendChild = vi.fn();
		const createObjectURL = vi.fn(() => 'blob:export');
		const revokeObjectURL = vi.fn();

		vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });
		vi.stubGlobal('document', {
			createElement: () => ({ click, download: '', href: '' }),
			body: { appendChild, removeChild }
		});

		const result = await downloadExportResult({
			mimeType: 'text/plain',
			content: 'hello',
			filename: 'export.txt'
		});

		expect(result).toEqual({ status: 'downloaded', filename: 'export.txt' });
		expect(createObjectURL).toHaveBeenCalled();
		expect(click).toHaveBeenCalled();
		expect(revokeObjectURL).toHaveBeenCalledWith('blob:export');
	});

	it('copyTextWithFallback uses clipboard when available', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		vi.stubGlobal('navigator', { clipboard: { writeText } });

		await expect(copyTextWithFallback('payload')).resolves.toBe(true);
		expect(writeText).toHaveBeenCalledWith('payload');
	});

	it('downloadExportResult uses platform.shareFile when native and returns shared', async () => {
		const { setHostPlatform, resetHostPlatform } = await import('./host-platform');
		const shareFile = vi.fn().mockResolvedValue({ status: 'shared' });
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'android',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			shareFile
		});

		const result = await downloadExportResult({
			mimeType: 'text/plain',
			content: 'hello',
			filename: 'native-export.txt'
		});

		expect(shareFile).toHaveBeenCalledWith('native-export.txt', 'hello', 'text/plain');
		expect(result).toEqual({ status: 'shared', filename: 'native-export.txt' });
		resetHostPlatform();
	});

	it('downloadExportResult returns canceled when native share is canceled', async () => {
		const { setHostPlatform, resetHostPlatform } = await import('./host-platform');
		const shareFile = vi.fn().mockResolvedValue({ status: 'canceled' });
		setHostPlatform({
			id: 'mobile',
			isNative: true,
			platformType: 'ios',
			supportsPwaInstall: false,
			shouldShowInstallGuide: false,
			shareFile
		});

		const result = await downloadExportResult({
			mimeType: 'text/plain',
			content: 'hello',
			filename: 'native-export.txt'
		});

		expect(result).toEqual({ status: 'canceled' });
		resetHostPlatform();
	});

	it('withTimeout rejects when the promise is too slow', async () => {
		await expect(withTimeout(new Promise<string>(() => {}), 10, 'slow')).rejects.toThrow('slow');
	});
});
