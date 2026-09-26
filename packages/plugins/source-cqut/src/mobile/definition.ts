import type { MobilePluginServerDefinition } from '@chronos/core';

export const mobilePluginDefinition = {
	pluginId: 'source-cqut',
	actions: ['preview'],
	cookieOrigins: ['https://uis.cqut.edu.cn', 'https://timetable-cfc.cqut.edu.cn']
} as const satisfies MobilePluginServerDefinition;
