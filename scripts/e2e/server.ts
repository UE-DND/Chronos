import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../../dist/e2e/', import.meta.url));
let build = 'old';
let failMarket = false;
const types: Record<string, string> = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.woff2': 'font/woff2',
	'.webp': 'image/webp'
};
const server = createServer((request, response) => {
	const pathname = decodeURIComponent(new URL(request.url!, 'http://localhost').pathname);
	if (request.method === 'POST' && pathname === '/__e2e/deploy') {
		build =
			new URL(request.url!, 'http://localhost').searchParams.get('build') === 'new' ? 'new' : 'old';
		failMarket = false;
		response.end(build);
		return;
	}
	if (request.method === 'POST' && pathname === '/__e2e/market-failure') {
		failMarket = new URL(request.url!, 'http://localhost').searchParams.get('enabled') === 'true';
		response.end(String(failMarket));
		return;
	}
	const market = pathname.startsWith('/__e2e/market/');
	if (market && failMarket) {
		response.writeHead(503);
		response.end('Simulated plugin download failure');
		return;
	}
	const directory = resolve(output, build, market ? 'market' : '.');
	const localPath = market
		? pathname.replace(/^\/__e2e\/market\/[^/]+\//, '')
		: pathname.replace(/^\/Chronos\/?/, '');
	let path = resolve(directory, localPath || 'index.html');
	if (!path.startsWith(directory + sep) && path !== directory) {
		response.writeHead(403);
		response.end();
		return;
	}
	if (!existsSync(path) || statSync(path).isDirectory()) {
		if (!market && !extname(localPath)) path = resolve(directory, 'index.html');
		else {
			response.writeHead(404);
			response.end(pathname);
			return;
		}
	}
	response.writeHead(200, {
		'Content-Type': types[extname(path)] ?? 'application/octet-stream',
		'Cache-Control': 'no-store'
	});
	response.end(readFileSync(path));
});
server.listen(4179, '127.0.0.1', () =>
	console.log('PWA regression server: http://127.0.0.1:4179/Chronos/')
);
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => server.close());
