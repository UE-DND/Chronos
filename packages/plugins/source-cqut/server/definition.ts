import type { PluginServerDefinition } from '@chronos/core';

export const serverDefinition = {
	pluginId: 'source-cqut',
	proxy: {
		action: 'preview',
		domains: ['cqut.edu.cn']
	}
} as const satisfies PluginServerDefinition;
