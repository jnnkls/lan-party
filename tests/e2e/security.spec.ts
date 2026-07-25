import { expect, test } from '@playwright/test';

test('sets baseline security headers', async ({ request, baseURL }) => {
	const response = await request.get(`${baseURL}/login`);
	const headers = response.headers();

	expect(headers['x-frame-options']).toBe('DENY');
	expect(headers['x-content-type-options']).toBe('nosniff');
	expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
	expect(headers['permissions-policy']).toContain('camera=()');

	const csp = headers['content-security-policy'];
	expect(csp).toContain("default-src 'self'");
	expect(csp).toContain("frame-ancestors 'none'");
	// script-src must stay nonce-based, never fall back to unsafe-inline.
	expect(csp).toMatch(/script-src[^;]*'nonce-[^']+'/);
	expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
});

test('rejects a cross-origin form POST (CSRF protection)', async ({ request, baseURL }) => {
	const response = await request.post(`${baseURL}/login`, {
		headers: { origin: 'https://evil.example.com' },
		form: { username: 'someone', password: 'whatever-password' },
		failOnStatusCode: false
	});
	expect(response.status()).toBe(403);
});

test('accepts a same-origin form POST (sanity check the CSRF test above is meaningful)', async ({
	request,
	baseURL
}) => {
	// Playwright's APIRequestContext doesn't send an Origin header unless told
	// to (unlike a real browser form submit) — set it explicitly to baseURL so
	// this actually exercises the "origin matches" path, not just "no origin".
	const response = await request.post(`${baseURL}/login`, {
		headers: { origin: baseURL! },
		form: { username: 'someone', password: 'whatever-password' },
		failOnStatusCode: false
	});
	// Wrong credentials, but same-origin — must not be blocked by CSRF (403).
	expect(response.status()).not.toBe(403);
});

test('session cookie is httpOnly and sameSite=Lax', async ({ page, context }) => {
	const username = `sectest${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
	await page.goto('/register');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill('correct-horse-battery-staple');
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page).toHaveURL(/\/home$/);

	const cookies = await context.cookies();
	const sessionCookie = cookies.find((c) => c.name === 'auth-session');
	expect(sessionCookie).toBeDefined();
	expect(sessionCookie?.httpOnly).toBe(true);
	expect(sessionCookie?.sameSite).toBe('Lax');
});

// Rate-limit *triggering* is deliberately not exercised end-to-end here: the
// limiter is keyed by client address and shared by every e2e test hitting
// /login in this same server process, so a loop that intentionally exhausts
// it would leak into other test files' legitimate logins (auth.spec.ts) for
// the rest of the 15-minute window. The limiter's own logic is already
// thoroughly covered in isolation by src/lib/server/rate-limit.test.ts;
// this file only checks that the login action doesn't shortcut past a
// clearly-invalid request some other way.
