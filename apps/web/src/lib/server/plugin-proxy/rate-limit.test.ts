import { describe, expect, it, beforeEach } from 'vite-plus/test';
import { PLUGIN_RATE_LIMIT_MAX, PLUGIN_RATE_LIMIT_WINDOW_MS } from './config';
import { PluginRateLimiter } from './rate-limit';

describe('PluginRateLimiter', () => {
	let limiter: PluginRateLimiter;

	beforeEach(() => {
		limiter = new PluginRateLimiter();
	});

	it('allows requests under the per-plugin limit', () => {
		for (let i = 0; i < PLUGIN_RATE_LIMIT_MAX; i++) {
			expect(limiter.check('source-cqut', '1.2.3.4')).toEqual({ allowed: true });
		}
	});

	it('blocks when the per-plugin limit is exceeded', () => {
		for (let i = 0; i < PLUGIN_RATE_LIMIT_MAX; i++) {
			limiter.check('source-cqut', '1.2.3.4');
		}
		const blocked = limiter.check('source-cqut', '1.2.3.4');
		expect(blocked.allowed).toBe(false);
		if (!blocked.allowed) {
			expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
		}
	});

	it('isolates rate limits by plugin id', () => {
		for (let i = 0; i < PLUGIN_RATE_LIMIT_MAX; i++) {
			limiter.check('source-cqut', '1.2.3.4');
		}
		expect(limiter.check('other-plugin', '1.2.3.4')).toEqual({ allowed: true });
	});

	it('isolates rate limits by client address', () => {
		for (let i = 0; i < PLUGIN_RATE_LIMIT_MAX; i++) {
			limiter.check('source-cqut', '1.2.3.4', 0);
		}
		expect(limiter.check('source-cqut', '1.2.3.5', 0)).toEqual({ allowed: true });
		expect(limiter.check('source-cqut', '1.2.3.4', 0).allowed).toBe(false);
	});

	it('renews each client window at its original expiry', () => {
		for (let i = 0; i < PLUGIN_RATE_LIMIT_MAX; i++) {
			limiter.check('source-cqut', 'early', 0);
			limiter.check('source-cqut', 'later', 1000);
		}
		expect(limiter.check('source-cqut', 'early', PLUGIN_RATE_LIMIT_WINDOW_MS)).toEqual({
			allowed: true
		});
		expect(limiter.check('source-cqut', 'later', PLUGIN_RATE_LIMIT_WINDOW_MS)).toEqual({
			allowed: false,
			retryAfterSeconds: 1
		});
		expect(limiter.check('source-cqut', 'later', PLUGIN_RATE_LIMIT_WINDOW_MS + 1000)).toEqual({
			allowed: true
		});
	});

	it('still renews an expired client after the system clock moves backwards', () => {
		limiter.check('source-cqut', 'first', 1000);
		for (let i = 0; i < PLUGIN_RATE_LIMIT_MAX; i++) {
			limiter.check('source-cqut', 'second', 0);
		}
		expect(limiter.check('source-cqut', 'second', PLUGIN_RATE_LIMIT_WINDOW_MS)).toEqual({
			allowed: true
		});
	});
});
