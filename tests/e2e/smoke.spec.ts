import { expect, test } from '@playwright/test';

test('root redirects to /home and renders the nav', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveURL(/\/home$/);
	await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});
