import { expect, test } from '@playwright/test';

// Runs against the real `vite dev` server (see playwright.config.ts's "dev"
// project), not the production build+preview every other e2e spec uses.
// Dev and build resolve some things differently — e.g. a static asset
// imported as a JS module (`import logo from '/logo.png'`) built fine but
// 500'd under `vite dev`, because SvelteKit's static-file server intercepted
// the `?import` request before Vite's asset pipeline saw it. That bug shipped
// through every phase of this rebuild because nothing ever ran `pnpm dev`
// itself — only `pnpm build && pnpm preview`. This file exists so a
// dev-only regression like that fails CI instead of only surfacing for
// someone running `pnpm dev` locally.

const routes = [
	'/home',
	'/leaderboard',
	'/lans',
	'/lans/lan-006',
	'/players',
	'/players/u1',
	'/wheel',
	'/login',
	'/register'
];

for (const path of routes) {
	test(`${path} loads under vite dev with no console errors`, async ({ page }) => {
		const problems: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') problems.push(msg.text());
		});
		page.on('pageerror', (err) => problems.push(err.message));

		const response = await page.goto(path, { waitUntil: 'networkidle' });
		expect(response?.ok()).toBe(true);
		await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
		expect(problems).toEqual([]);
	});
}
