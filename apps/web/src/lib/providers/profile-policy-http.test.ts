import { describe, expect, it, vi } from 'vite-plus/test';
import { ProfilePolicyHttpAdapter } from './profile-policy-http';

describe('profile server capabilities', () => {
	it('blocks direct native or Web calls while retaining ordinary requests and other actions', async () => {
		const request = vi.fn().mockResolvedValue({ ok: true });
		const proxy = vi.fn().mockResolvedValue({ ok: true });
		const adapter = new ProfilePolicyHttpAdapter(
			{ request, proxy, supportsPluginServer: () => true },
			[{ pluginId: 'source-cqut', action: 'preview' }]
		);
		expect(adapter.supportsPluginServer('source-cqut', 'preview')).toBe(false);
		await expect(adapter.proxy('source-cqut', 'preview', {})).rejects.toThrow('denied by profile');
		expect(proxy).not.toHaveBeenCalled();
		await adapter.request('https://example.com/plugins/releases/1.0.2/catalog.json');
		expect(request).toHaveBeenCalledOnce();
		expect(adapter.supportsPluginServer('other', 'preview')).toBe(true);
		await adapter.proxy('other', 'preview', {});
		expect(proxy).toHaveBeenCalledOnce();
	});
});
