import type { Cookie, ICookieJar } from '@cqut-openproject/cas-sdk';
export type { Cookie, ICookieJar };

export interface CqutRequest {
	url: string;
	method?: string;
	headers?: Record<string, string>;
	body?: string;
	disableRedirects?: boolean;
	connectTimeoutMs?: number;
	readTimeoutMs?: number;
	signal?: AbortSignal;
}

export interface CqutResponse {
	readonly status: number;
	readonly headers: Record<string, string | string[]>;
	readonly url: string;
	text(): Promise<string>;
	json<T = unknown>(): Promise<T>;
	getSetCookie?(): string[];
}

export interface CqutSession {
	request(input: CqutRequest): Promise<CqutResponse>;
	createCasCookieJar(): ICookieJar;
	hasCookie(url: string, name: string): Promise<boolean>;
	dispose(): Promise<void>;
}
