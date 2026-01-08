import { test, expect } from '@playwright/test';
import { MainPage } from '../../src/pages/realworld.qa.guru/main.page';
import { RegisterPage } from '../../src/pages/realworld.qa.guru/register.page';
import { fakerRU } from '@faker-js/faker';
import {
	generateNewUser,
	getUserInfo,
} from '../../src/helpers/generateData';

test.describe('[Positive Cases][MainPage]', () => {
	test('Переход на страницу с регистрацией', async ({ page }) => {
		// Create main page object
		const mainPage = new MainPage(page);

		// Visit main page
		await mainPage.open('https://realworld.qa.guru/');

		// Go to register page (Sign Up)
		await mainPage.goToRegister();

		// Asserts for main scenario
		await expect(mainPage.locatorPageHeading).toHaveText('Sign up');
	});
});

test.describe('[Positive Cases][RegisterPage]', () => {
	let userInfo = { userName: null, userEmail: null, userPassword: null };

	test.beforeAll('Получение сгенерированного пользователя', async () => {
		userInfo = await generateNewUser();
	});

	test('Регистрация нового пользователя', async ({ page }) => {
		// Create RegisterPage and MainPage object
		const registerPage = new RegisterPage(page);
		const mainPage = new MainPage(page);

		// Visit to "Register Page"
		await registerPage.open('https://realworld.qa.guru/#/register');

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
		await expect(page).toHaveURL('https://realworld.qa.guru/#/');

		// This is SETTER for MainPage Class
		// I want to pass the username to the locator.
		mainPage.userName = userInfo.userName;

		// Finally check registration in Application
		await expect(mainPage.locatorNavLinkWithUserName).toBeVisible();
		await expect(mainPage.locatorNavLinkWithUserName).toHaveText(
			userInfo.userName
		);
	});
});
