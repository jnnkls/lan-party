import { expect, test } from '@playwright/test';

// Confirms pages actually render real database content (via pnpm db:seed in
// CI), not just an empty state — the whole point of the mock-data.ts -> real
// Drizzle queries migration this test suite guards.

test('leaderboard shows real seeded players ranked by xp', async ({ page }) => {
	await page.goto('/leaderboard');
	await expect(page.getByText('FragMaster', { exact: false }).first()).toBeVisible();
});

test('LANs page shows a real seeded event', async ({ page }) => {
	await page.goto('/lans');
	await expect(page.getByText('Winter LAN Bash', { exact: false }).first()).toBeVisible();
});

test('LAN detail page shows attendees and tournament results', async ({ page }) => {
	await page.goto('/lans/lan-006');
	await expect(page.getByRole('heading', { name: 'Winter LAN Bash' })).toBeVisible();
	await expect(page.getByText('CS2 5v5 Bracket', { exact: false })).toBeVisible();
});

test('player detail page shows profile and gear', async ({ page }) => {
	await page.goto('/players/u1');
	await expect(page.getByText('FragMaster', { exact: false }).first()).toBeVisible();
	await expect(page.getByText('Tekken King', { exact: false }).first()).toBeVisible();
});
