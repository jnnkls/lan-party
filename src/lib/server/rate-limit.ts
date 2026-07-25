/**
 * Minimal in-memory fixed-window rate limiter for auth endpoints (login/register).
 * Single-process only — fine for this app's scale; a shared store (e.g. Redis)
 * would be needed behind more than one server instance.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = { allowed: boolean; retryAfterMs: number };

export function checkRateLimit(
	key: string,
	limit: number,
	windowMs: number,
	now: number = Date.now()
): RateLimitResult {
	const bucket = buckets.get(key);

	if (!bucket || now >= bucket.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, retryAfterMs: 0 };
	}

	if (bucket.count >= limit) {
		return { allowed: false, retryAfterMs: bucket.resetAt - now };
	}

	bucket.count += 1;
	return { allowed: true, retryAfterMs: 0 };
}

/** Test-only: clears all buckets so test cases don't leak state into each other. */
export function _resetRateLimitsForTests() {
	buckets.clear();
}
