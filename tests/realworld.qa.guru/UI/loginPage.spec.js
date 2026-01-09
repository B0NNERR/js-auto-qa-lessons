import { test, expect } from '@playwright/test';
import { registrationUserAndLogout } from '../../../src/helpers/userInfo.helper';
import {
	MainPage,
	LoginPage,
} from '../../../src/pages/realworld.qa.guru/index';

test.describe('[Positive Cases][LoginPage]', () => {
	let userInfo = { userName: null, userEmail: null, userPassword: null };

	test('Авторизация существующего пользователя', async ({ page }) => {
		userInfo = await registrationUserAndLogout(page);

		// Create LoginPage and MainPage object
		const loginPage = new LoginPage(page);
		const mainPage = new MainPage(page);

		// Visit to "Register Page"
		await loginPage.open(LoginPage.URL);

		// Fill form fields
		await loginPage.fillUserEmailField(userInfo.userEmail);
		await loginPage.fillUserPasswordField(userInfo.userPassword);

		// Asserts for filling fields in form
		await expect(loginPage.userEmailField).toBeVisible();
		await expect(loginPage.userEmailField).toHaveValue(userInfo.userEmail);
		await expect(loginPage.userPasswordField).toBeVisible();
		await expect(loginPage.userPasswordField).toHaveValue(
			userInfo.userPassword
		);

		// Submit Register Form after filled fields and checked them values
		await loginPage.submitForm();

		// Assert for form submit and register new USER
		await expect(page).toHaveURL(MainPage.URL);

		// Finally check registration in Application
		await expect(mainPage.locatorNavLinkWithUserName).toBeVisible();
		await expect(mainPage.locatorNavLinkWithUserName).toHaveText(
			userInfo.userName
		);
	});
});
