import { test, expect } from '@playwright/test';
import { generateNewUser } from '../../../src/helpers/userInfo.helper';
import {
	MainPage,
	RegisterPage,
} from '../../../src/pages/realworld.qa.guru/index';

test.describe('[Positive Cases][RegisterPage]', () => {
	let userInfo = { userName: null, userEmail: null, userPassword: null };

	test('Регистрация нового пользователя', async ({ page }) => {
		userInfo = await generateNewUser();

		// Create RegisterPage and MainPage object
		const mainPage = new MainPage(page);
		const registerPage = new RegisterPage(page);

		// Visit to "Register Page"
		await registerPage.open(RegisterPage.URL);

		// Fill form fields
		await registerPage.fillUserNameField(userInfo.userName);
		await registerPage.fillUserEmailField(userInfo.userEmail);
		await registerPage.fillUserPasswordField(userInfo.userPassword);

		// Asserts for filling fields in form
		await expect(registerPage.userNameField).toBeVisible();
		await expect(registerPage.userNameField).toHaveValue(userInfo.userName);
		await expect(registerPage.userEmailField).toBeVisible();
		await expect(registerPage.userEmailField).toHaveValue(userInfo.userEmail);
		await expect(registerPage.userPasswordField).toBeVisible();
		await expect(registerPage.userPasswordField).toHaveValue(
			userInfo.userPassword
		);

		// Submit Register Form after filled fields and checked them values
		await registerPage.submitForm();

		// Assert for form submit and register new USER
		await expect(page).toHaveURL(MainPage.URL);

		// Finally check registration in Application
		await expect(mainPage.locatorNavLinkWithUserName).toBeVisible();
		await expect(mainPage.locatorNavLinkWithUserName).toHaveText(
			userInfo.userName
		);
	});
});
