import { PLUGIN_RATE_LIMIT_MAX, PLUGIN_RATE_LIMIT_WINDOW_MS } from './config';

interface RateLimitBucket {
	count: number;
	resetAt: number;
}

function bucketKey(pluginId: string, ip: string): string {
	return `${pluginId}:${ip}`;
}

export type RateLimitResult = { allowed: true } | { allowed: false; retryAfterSeconds: number };

/** Per-process protection. Deployments with multiple instances need an upstream rate limit. */
export class PluginRateLimiter {
	private readonly buckets = new Map<string, RateLimitBucket>();

	private pruneExpiredBuckets(now: number): void {
		for (const [key, bucket] of this.buckets) {
			// New buckets have the same lifetime and follow insertion order. Stop at
			// the first live bucket instead of scanning every client on every request.
			if (bucket.resetAt > now) break;
			this.buckets.delete(key);
		}
	}

	check(pluginId: string, ip: string, now = Date.now()): RateLimitResult {
		this.pruneExpiredBuckets(now);

		const key = bucketKey(pluginId, ip);
		const bucket = this.buckets.get(key);
		if (!bucket || bucket.resetAt <= now) {
			// Reinsert expired entries so clock corrections cannot leave a renewed
			// bucket ahead of entries that should be collected sooner.
			this.buckets.delete(key);
			this.buckets.set(key, { count: 1, resetAt: now + PLUGIN_RATE_LIMIT_WINDOW_MS });
			return { allowed: true };
		}

		if (bucket.count >= PLUGIN_RATE_LIMIT_MAX) {
			return {
				allowed: false,
				retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000))
			};
		}

		bucket.count += 1;
		return { allowed: true };
	}
}

export const defaultPluginRateLimiter = new PluginRateLimiter();
