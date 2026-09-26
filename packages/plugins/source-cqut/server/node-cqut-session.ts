import type { ICookieJar } from '@cqut-openproject/cas-sdk';
import { fetch as undiciFetch, type RequestInit as UndiciRequestInit } from 'undici';
import type { CqutRequest, CqutResponse, CqutSession } from '../src/online';
import { CookieJar } from './cookie-jar';
import { getCqutDispatcher } from './dispatcher';

export class NodeCqutSession implements CqutSession {
	readonly jar: CookieJar;

	constructor(jar?: CookieJar) {
		this.jar = jar ?? new CookieJar();
	}

	createCasCookieJar(): ICookieJar {
		return this.jar;
	}

	async hasCookie(url: string, name: string): Promise<boolean> {
		return this.jar.hasCookie(url, name);
	}

	async request(input: CqutRequest): Promise<CqutResponse> {
		const headers = new Headers(input.headers);
		const cookieHeader = this.jar.cookieHeader(input.url);
		if (cookieHeader) {
			headers.set('cookie', cookieHeader);
		}

		const requestInit: UndiciRequestInit = {
			method: input.method ?? 'GET',
			headers: Object.fromEntries(headers),
			body: input.body,
			redirect: input.disableRedirects ? 'manual' : 'follow',
			signal: input.signal,
			dispatcher: getCqutDispatcher()
		};

		const response = (await undiciFetch(input.url, requestInit)) as unknown as Response;
		this.jar.storeFrom(response, input.url);

		const responseHeaders: Record<string, string | string[]> = {};
		response.headers.forEach((val, key) => {
			responseHeaders[key.toLowerCase()] = val;
			responseHeaders[key] = val;
		});

		const rawHeaders = response.headers as Headers & { getSetCookie?: () => string[] };
		const setCookieList =
			rawHeaders.getSetCookie?.() ??
			(response.headers.get('set-cookie') ? [response.headers.get('set-cookie')!] : []);
		if (setCookieList.length > 0) {
			responseHeaders['set-cookie'] = setCookieList;
		}

		return {
			status: response.status,
			headers: responseHeaders,
			url: response.url || input.url,
			text: () => response.text(),
			json: <T = unknown>() => response.json() as Promise<T>,
			getSetCookie: () => setCookieList
		};
	}

	async dispose(): Promise<void> {
		this.jar.clear();
	}
}
