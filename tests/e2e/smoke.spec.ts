import { expect, test } from '@playwright/test';

test('root redirects to /home and renders the nav', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/home$/);
	await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});

// Every route from agent.yml's optional_smoke_routes, as an automated (not
// just manual) check — data-wiring.spec.ts and auth.spec.ts already cover
// /home, /leaderboard, /lans(/[slug]), /players/[slug], /login, /register
// with content assertions; this just confirms the remaining routes render
// without an error page.
for (const path of ['/players', '/wheel']) {
	test(`${path} renders without an error page`, async ({ page }) => {
		const response = await page.goto(path);
		expect(response?.ok()).toBe(true);
		await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
	});
}
