import { describe, expect, it } from 'vite-plus/test';
import { serverDefinition } from '../server/definition';
import { serverManifest } from '../server/index';

describe('CQUT server declaration', () => {
	it('advertises an implemented POST action', () => {
		expect(serverManifest.handlers[serverDefinition.proxy.action]?.POST).toBeTypeOf('function');
		expect(serverManifest.proxy).toEqual(serverDefinition.proxy);
	});
});
