import { describe, expect, it } from 'vitest';
import { _resetRateLimitsForTests, checkRateLimit } from './rate-limit';

describe('checkRateLimit', () => {
	it('allows requests up to the limit', () => {
		_resetRateLimitsForTests();
		const key = 'test-a';
		expect(checkRateLimit(key, 3, 1000, 0).allowed).toBe(true);
		expect(checkRateLimit(key, 3, 1000, 10).allowed).toBe(true);
		expect(checkRateLimit(key, 3, 1000, 20).allowed).toBe(true);
	});

	it('blocks requests once the limit is exceeded within the window', () => {
		_resetRateLimitsForTests();
		const key = 'test-b';
		checkRateLimit(key, 2, 1000, 0);
		checkRateLimit(key, 2, 1000, 10);
		const third = checkRateLimit(key, 2, 1000, 20);
		expect(third.allowed).toBe(false);
		expect(third.retryAfterMs).toBeGreaterThan(0);
	});

	it('resets after the window elapses', () => {
		_resetRateLimitsForTests();
		const key = 'test-c';
		checkRateLimit(key, 1, 1000, 0);
		expect(checkRateLimit(key, 1, 1000, 500).allowed).toBe(false);
		expect(checkRateLimit(key, 1, 1000, 1500).allowed).toBe(true);
	});

	it('tracks separate keys independently', () => {
		_resetRateLimitsForTests();
		checkRateLimit('user-1', 1, 1000, 0);
		const other = checkRateLimit('user-2', 1, 1000, 0);
		expect(other.allowed).toBe(true);
	});
});
