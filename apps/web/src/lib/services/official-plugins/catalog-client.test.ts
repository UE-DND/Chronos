import { describe, expect, it, vi, beforeEach, type Mock } from 'vite-plus/test';
import { ChronosEngine } from '@chronos/core';
import type { ChronosEnv, HttpRequestOptions, HttpResponse } from '@chronos/core';
import { DEFAULT_USER_PREFERENCES } from '@chronos/core';
import { OfficialPluginCatalogClient } from './catalog-client';

type HttpMock = Mock<(url: string, options?: HttpRequestOptions) => Promise<HttpResponse>>;

function httpResponse(overrides: Partial<HttpResponse> = {}): HttpResponse {
	return {
		status: 200,
		statusText: 'OK',
		headers: {},
		ok: true,
		text: async () => '',
		json: async <T>() => undefined as T,
		bytes: async () => new Uint8Array(),
		...overrides
	};
}

function createMockEnv(httpRequest: HttpMock) {
	const env: ChronosEnv = {
		platform: 'node',
		http: { request: httpRequest },
		storage: {
			getTimetable: async () => null,
			listTimetables: async () => [],
			saveTimetable: async () => {},
			deleteTimetable: async () => {},
			getActiveTimetableId: async () => null,
			setActiveTimetableId: async () => {},
			queryCourses: async () => [],
			getPreferences: async () => ({ ...DEFAULT_USER_PREFERENCES }),
			savePreferences: async () => {},
			getPluginData: async () => null,
			setPluginData: async () => {},
			deletePluginData: async () => {},
			onChanged: () => ({ dispose: () => {} })
		},
		vault: {
			isSupported: async () => false,
			storeSecret: vi.fn(),
			getSecret: vi.fn(),
			removeSecret: vi.fn()
		},
		runtime: {
			sha256: async () => 'hash'
		}
	};
	return env;
}

describe('OfficialPluginCatalogClient', () => {
	let engine: ChronosEngine;
	let httpRequest: HttpMock;
	let client: OfficialPluginCatalogClient;

	beforeEach(async () => {
		httpRequest = vi.fn();
		engine = new ChronosEngine({ env: createMockEnv(httpRequest), onNotification: vi.fn() });
		await engine.init();
		client = new OfficialPluginCatalogClient(engine);
	});

	it('rejects invalid catalog schema', async () => {
		httpRequest.mockResolvedValueOnce(
			httpResponse({
				json: async () => ({ version: 1 }) as never
			})
		);

		await expect(client.fetchCatalog()).rejects.toThrow(/Invalid official plugin catalog/);
	});

	it('rejects catalog versions outside the current format', async () => {
		for (const version of [undefined, 2, 3]) {
			httpRequest.mockResolvedValueOnce(
				httpResponse({
					json: async <T>() => ({ version, updatedAt: 1, manifests: ['/m.json'] }) as T
				})
			);
			await expect(client.fetchCatalog()).rejects.toThrow(/Invalid official plugin catalog/);
		}
	});

	it('fetches valid catalog', async () => {
		httpRequest.mockResolvedValueOnce(
			httpResponse({
				json: async <T>() => ({ version: 1, updatedAt: 1, manifests: ['/m.json'] }) as T
			})
		);

		const catalog = await client.fetchCatalog();
		expect(catalog.manifests).toEqual(['/m.json']);
	});
	it('resolves relative manifests at a remote release directory', async () => {
		httpRequest.mockResolvedValueOnce(
			httpResponse({
				json: async <T>() =>
					({ version: 1, manifests: ['./manifests/rev/tool-clock.manifest.json'] }) as T
			})
		);
		const result = await client.fetchCatalog(
			'https://ue-dnd.github.io/Chronos/plugins/releases/1.2.3/catalog.json'
		);
		expect(result.manifests).toEqual([
			'https://ue-dnd.github.io/Chronos/plugins/releases/1.2.3/manifests/rev/tool-clock.manifest.json'
		]);
	});
	it('resolves local relative manifests beneath the deployment base, preserving external URLs', async () => {
		httpRequest.mockResolvedValueOnce(
			httpResponse({
				json: async <T>() =>
					({
						version: 1,
						manifests: [
							'./manifests/rev/theme-m3.manifest.json',
							'https://external.example/plugin.json'
						]
					}) as T
			})
		);
		const result = await client.fetchCatalog('/Chronos/official-plugins/catalog.json');
		expect(result.manifests).toEqual([
			'/Chronos/official-plugins/manifests/rev/theme-m3.manifest.json',
			'https://external.example/plugin.json'
		]);
	});
});
