import { MemoryCookieJar } from '@cqut-openproject/cas-sdk';
import { TIMETABLE_HOST, TIMETABLE_SESSION_COOKIE } from './config';

export function getResponseCookies(headers: Headers): string[] {
	const cookieHeaders = headers as Headers & {
		getSetCookie?: () => string[];
		getAll?: (name: string) => string[];
	};
	if (typeof cookieHeaders.getSetCookie === 'function') return cookieHeaders.getSetCookie();
	if (typeof cookieHeaders.getAll === 'function') return cookieHeaders.getAll('Set-Cookie');
	const value = headers.get('set-cookie');
	return value ? [value] : [];
}

export class CookieJar extends MemoryCookieJar {
	storeFrom(response: Response, requestUrl?: string): void {
		const resolvedUrl = response.url || requestUrl;
		if (!resolvedUrl) return;

		this.setCookies(getResponseCookies(response.headers), resolvedUrl);
	}

	cookieHeader(url: string): string | undefined {
		const str = this.getCookieString(url);
		return str || undefined;
	}

	hasCookie(host: string, name: string): boolean {
		const testUrl = host.startsWith('http') ? host : `https://${host}/`;
		return this.getCookies(testUrl).some((c) => c.name === name);
	}

	hasTimetableSession(): boolean {
		return this.hasCookie(TIMETABLE_HOST, TIMETABLE_SESSION_COOKIE);
	}
}
