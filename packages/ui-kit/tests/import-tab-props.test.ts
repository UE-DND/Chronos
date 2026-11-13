import { describe, expect, it, vi } from 'vite-plus/test';
import {
	createImportConfirmTransfer,
	createImportTabTransfer
} from '../src/plugin-screen/import-tab-props';

describe('plugin import boundary', () => {
	it('limits previews to the owning source and refuses work after the instance stops', async () => {
		const instance = new AbortController();
		const host = {
			state: { errorMessage: null, secret: 'host state' },
			previewWithSlot: vi.fn(async () => true),
			confirmImport: vi.fn()
		};
		const transfer = createImportTabTransfer(host, 'own-tab', instance);
		expect(Object.keys(transfer)).toEqual(['state', 'previewWithSlot']);
		expect(Object.keys(transfer.state)).toEqual(['errorMessage']);
		expect(Object.isFrozen(transfer.state)).toBe(true);
		await expect(transfer.previewWithSlot('another-tab', {})).rejects.toThrow('does not own');
		await expect(transfer.previewWithSlot('own-tab', { content: 'input' })).resolves.toBe(true);
		expect(host.previewWithSlot).toHaveBeenCalledExactlyOnceWith('own-tab', { content: 'input' });
		instance.abort();
		await expect(transfer.previewWithSlot('own-tab', {})).rejects.toThrow('stopped');
		expect(host.previewWithSlot).toHaveBeenCalledTimes(1);
	});

	it('owns a frozen confirmation snapshot and only permits confirmation input changes', () => {
		const instance = new AbortController();
		const host = {
			state: { confirmInputs: { nested: { year: 2026 } }, privateValue: true },
			setConfirmInputs: vi.fn(),
			confirmImport: vi.fn()
		};
		const transfer = createImportConfirmTransfer(host, instance);
		expect(Object.keys(transfer)).toEqual(['state', 'setConfirmInputs']);
		expect(transfer.state.confirmInputs).not.toBe(host.state.confirmInputs);
		expect(Object.isFrozen(transfer.state.confirmInputs.nested)).toBe(true);
		transfer.setConfirmInputs({ year: 2027 });
		expect(host.setConfirmInputs).toHaveBeenCalledExactlyOnceWith({ year: 2027 });
		instance.abort();
		expect(() => transfer.setConfirmInputs({})).toThrow('stopped');
		expect(host.setConfirmInputs).toHaveBeenCalledTimes(1);
	});
});
