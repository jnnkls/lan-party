import { expect, test } from '@playwright/test';

function uniqueUsername() {
	return `e2euser${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

test('register, logout, and log back in', async ({ page }) => {
	const username = uniqueUsername();
	const password = 'correct-horse-battery-staple';

	await page.goto('/register');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Create account' }).click();

	await expect(page).toHaveURL(/\/home$/);
	await expect(page.getByText(username, { exact: false })).toBeVisible();

	await page.getByRole('button', { name: 'Logout' }).click();
	await expect(page).toHaveURL(/\/home$/);
	await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();

	await page.goto('/login');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Log in' }).click();

	await expect(page).toHaveURL(/\/home$/);
	await expect(page.getByText(username, { exact: false })).toBeVisible();
});

test('shows an error for an incorrect password', async ({ page }) => {
	const username = uniqueUsername();
	const password = 'correct-horse-battery-staple';

	await page.goto('/register');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Create account' }).click();
	await expect(page).toHaveURL(/\/home$/);

	await page.getByRole('button', { name: 'Logout' }).click();

	await page.goto('/login');
	await page.getByLabel('Username').fill(username);
	await page.getByLabel('Password').fill('totally-wrong-password');
	await page.getByRole('button', { name: 'Log in' }).click();

	await expect(page.getByText('Incorrect username or password')).toBeVisible();
});
