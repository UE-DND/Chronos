import type { PluginServerHandler, PluginServerManifest } from '@chronos/core';
import { pluginServerError } from '@chronos/core';
import { executeCqutPreview } from '../src/online';
import { serverDefinition } from './definition';
import { NodeCqutSession } from './node-cqut-session';

export const handlePreview: PluginServerHandler = async ({ request }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return Response.json(pluginServerError('DataFormat', '请求格式错误'), { status: 400 });
	}

	const result = await executeCqutPreview(body, () => new NodeCqutSession(), undefined, {
		signal: request.signal
	});

	const status = result.ok
		? 200
		: result.error.kind === 'Validation' || result.error.kind === 'DataFormat'
			? 400
			: 502;

	return Response.json(result, { status });
};

export const serverManifest: PluginServerManifest = {
	handlers: {
		[serverDefinition.proxy.action]: { POST: handlePreview }
	},
	proxy: {
		domains: [...serverDefinition.proxy.domains],
		action: serverDefinition.proxy.action
	}
};
