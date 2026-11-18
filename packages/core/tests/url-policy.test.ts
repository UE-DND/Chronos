import { describe, expect, it } from 'vite-plus/test';
import {
	belongsToDomain,
	intersectAllowedDomains,
	isAllowedDomainPattern,
	isBareHttpsUrl,
	isBareUrl,
	isHttpsOrigin
} from '../src/hosts/url-policy';

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

	it.each([
		'example.org',
		'*.example.org',
		'Example.org.',
		'cqut.edu.cn',
		'*.cqut.edu.cn',
		'fastly.jsdelivr.net',
		'raw.githubusercontent.com',
		'city.kawasaki.jp',
		'school.pvt.k12.ma.us',
		'attacker.test'
	])('accepts allowed domain pattern %s', (pattern) => {
		expect(isAllowedDomainPattern(pattern)).toBe(true);
	});

	it.each([
		'',
		'com',
		'*.com',
		'localhost',
		'127.0.0.1',
		'192.168.1.1',
		'[::1]',
		'1.2',
		'bad..example.org',
		'example.org..',
		'*.*.example.org',
		'https://example.org',
		'-bad.example.org',
		'co.uk',
		'*.co.uk',
		'edu.cn',
		'*.edu.cn',
		'com.cn',
		'com.hk',
		'co.jp',
		'pvt.k12.ma.us',
		'example.kawasaki.jp',
		'xn--55qx5d.cn',
		'github.io',
		'githubusercontent.com',
		'jsdelivr.net',
		'pages.dev',
		'vercel.app',
		'netlify.app'
	])('rejects single-label, malformed, IP, or public-suffix pattern %s', (pattern) => {
		expect(isAllowedDomainPattern(pattern)).toBe(false);
	});

	it('ignores single-label, IP, and public-suffix rules in belongsToDomain', () => {
		expect(belongsToDomain('evil.com', ['com'])).toBe(false);
		expect(belongsToDomain('evil.com', ['*.com'])).toBe(false);
		expect(belongsToDomain('school.edu.cn', ['edu.cn'])).toBe(false);
		expect(belongsToDomain('school.edu.cn', ['*.edu.cn'])).toBe(false);
		expect(belongsToDomain('user.github.io', ['github.io'])).toBe(false);
		expect(belongsToDomain('localhost', ['localhost'])).toBe(false);
		expect(belongsToDomain('127.0.0.1', ['127.0.0.1'])).toBe(false);
		expect(belongsToDomain('*.example.org', ['example.org'])).toBe(false);
		expect(belongsToDomain('fastly.jsdelivr.net', ['fastly.jsdelivr.net'])).toBe(true);
		expect(belongsToDomain('raw.githubusercontent.com', ['raw.githubusercontent.com'])).toBe(true);
		expect(belongsToDomain('sub.attacker.test', ['attacker.test'])).toBe(true);
	});

	it('intersects manifest and package allowedDomains without widening manifest scope', () => {
		expect(intersectAllowedDomains([], ['example.org'])).toEqual([]);
		expect(intersectAllowedDomains(['example.org'], undefined)).toEqual(['example.org']);
		expect(intersectAllowedDomains(['example.org'], [])).toEqual([]);
		expect(intersectAllowedDomains(['example.org'], ['api.example.org', 'evil.org'])).toEqual([
			'api.example.org'
		]);
		expect(intersectAllowedDomains(['api.example.org'], ['example.org', 'evil.org'])).toEqual([
			'api.example.org'
		]);
		expect(intersectAllowedDomains(['*.cqut.edu.cn'], ['cqut.edu.cn'])).toEqual(['cqut.edu.cn']);
	});
});
