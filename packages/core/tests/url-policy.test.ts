import { describe, expect, it } from 'vite-plus/test';
import { belongsToDomain, isBareHttpsUrl, isBareUrl, isHttpsOrigin } from '../src/hosts/url-policy';

describe('URL policy', () => {
	it.each(['https://example.org', 'https://example.org/', 'https://example.org/plugins'])(
		'accepts bare HTTPS URL %s',
		(value) => {
			expect(isBareHttpsUrl(new URL(value))).toBe(true);
		}
	);

	it.each([
		'http://example.org',
		'https://user@example.org',
		'https://user:pass@example.org',
		'https://example.org/?token=1',
		'https://example.org/#fragment'
	])('rejects non-bare HTTPS URL %s', (value) => {
		expect(isBareHttpsUrl(new URL(value))).toBe(false);
	});

	it('allows http when only credentials, query, and fragment are excluded', () => {
		expect(isBareUrl(new URL('http://localhost/plugins'))).toBe(true);
		expect(isBareUrl(new URL('http://user@localhost/plugins'))).toBe(false);
		expect(isBareUrl(new URL('http://localhost/plugins?token=1'))).toBe(false);
	});

	it('accepts only root-path HTTPS origins', () => {
		expect(isHttpsOrigin(new URL('https://example.org'))).toBe(true);
		expect(isHttpsOrigin(new URL('https://example.org/'))).toBe(true);
		expect(isHttpsOrigin(new URL('https://example.org/path'))).toBe(false);
		expect(isHttpsOrigin(new URL('http://example.org/'))).toBe(false);
	});

	it('matches domains and subdomains only', () => {
		expect(belongsToDomain('example.org', ['example.org'])).toBe(true);
		expect(belongsToDomain('login.example.org', ['example.org'])).toBe(true);
		expect(belongsToDomain('LOGIN.EXAMPLE.ORG', ['Example.org'])).toBe(true);
		expect(belongsToDomain('evil-example.org', ['example.org'])).toBe(false);
		expect(belongsToDomain('example.org.evil.com', ['example.org'])).toBe(false);
		expect(belongsToDomain('example.org', [])).toBe(false);
	});

	it('accepts optional wildcard prefixes in declared domains', () => {
		expect(belongsToDomain('cqut.edu.cn', ['*.cqut.edu.cn'])).toBe(true);
		expect(belongsToDomain('api.cqut.edu.cn', ['*.cqut.edu.cn'])).toBe(true);
		expect(belongsToDomain('cqut.edu.cn.attacker.test', ['*.cqut.edu.cn'])).toBe(false);
	});
});
