import { test, expect } from '@playwright/test';

test('title', async ({ page }) => {
	// Constants
	const MAIN_PAGE = 'https://www.google.com/';
	const QUERY = 'Тест на Playwright';

	// Locators
	const searchField = page.locator('textarea[name="q"]');
	const cookieModalWindow = page.locator('h1', {
		hasText: 'Before you continue to Google',
	});
	const buttonAcceptCookies = page.getByRole('button', { name: 'Accept all' });

	// Scenario
	await page.goto(MAIN_PAGE);

	if (await cookieModalWindow.isVisible()) {
		await buttonAcceptCookies.click();
	}

	await searchField.fill(QUERY);
	await searchField.press('Enter');

	await page.waitForURL(/\/search\?q\=/);

	await expect(page).toHaveURL((url) => {
		console.log(url.pathname);
		const queryParams = url.searchParams;
		return (
			queryParams.has('q') && queryParams.get('q') == QUERY.replaceAll(' ', '+')
		);
	});
});
