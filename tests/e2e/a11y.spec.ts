import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page has no critical accessibility violations', async ({ page }) => {
	await page.goto('/home');

	const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();

	expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
});
