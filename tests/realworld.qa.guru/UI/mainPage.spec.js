import { test, expect } from '@playwright/test';
import {
	generateNewUser,
	registrationUserAndLogout,
} from '../../../src/helpers/userInfo.helper.js';
import {
	MainPage,
	LoginPage,
	RegisterPage,
} from '../../../src/pages/realworld.qa.guru/index';

test.describe('[Positive Cases][MainPage]', () => {
	let userInfo = { userName: null, userEmail: null, userPassword: null };

	test.beforeEach(
		'Переход на главную страницу перед каждым тестом',
		async ({ page }) => {
			const mainPage = new MainPage(page);
			await mainPage.open(MainPage.URL);
		}
	);

	// WITHOUT USER

	test('Переход на страницу с регистрацией', async ({ page }) => {
		// Create main page object
		const mainPage = new MainPage(page);

		// Go to register page (Sign Up)
		await mainPage.goToRegister();

		// Asserts for main scenario
		await expect(mainPage.locatorPageHeading).toHaveText('Sign up');
	});

	test('Переход на страницу с авторизацией', async ({ page }) => {
		// Create main page object
		const mainPage = new MainPage(page);

		// Go to register page (Sign Up)
		await mainPage.goToLogin();

		// Asserts for main scenario
		await expect(mainPage.locatorPageHeading).toHaveText('Sign in');
	});

	// WITH USER

	test('Разлогиниться под новым пользователем', async ({ page }) => {
		userInfo = await generateNewUser();
		const registerPage = new RegisterPage(page);
		const mainPage = new MainPage(page);

		// Visit to "Register Page"
		await registerPage.open(RegisterPage.URL);

		// Fill form fields
		await registerPage.fillUserNameField(userInfo.userName);
		await registerPage.fillUserEmailField(userInfo.userEmail);
		await registerPage.fillUserPasswordField(userInfo.userPassword);

		// Submit Register Form after filled fields
		await registerPage.submitForm();
		await mainPage.open(MainPage.URL);

		// Click to username
		await mainPage.clickToUserName();

		// Check that the dropdown menu has opened and there is a logout link.
		await expect(mainPage.locatorDropDownMenu).toBeVisible();
		await expect(mainPage.locatorLogoutLink).toBeVisible();

		// Click logout link
		await mainPage.clickToLogout();

		// Check that the dropdown menu has hidden and the link too.
		await expect(mainPage.locatorDropDownMenu).not.toBeVisible();
		await expect(mainPage.locatorLogoutLink).not.toBeVisible();

		// Check that the .nav-link contains a Sign Up link
		// And check page url
		await expect(mainPage.locatorSignUpLink).toBeVisible();
		await expect(mainPage.locatorLogInLink).toBeVisible();
	});

	test('Разлогиниться под существующим пользователем', async ({ page }) => {
		const userInfo = await registrationUserAndLogout(page);

		const mainPage = new MainPage(page);
		const loginPage = new LoginPage(page);

		// Visit to "Login Page"
		await loginPage.open(LoginPage.URL);

		// Fill form fields
		await loginPage.fillUserEmailField(userInfo.userEmail);
		await loginPage.fillUserPasswordField(userInfo.userPassword);

		// Submit Login Form after filled fields
		await loginPage.submitForm();
		await mainPage.open(MainPage.URL);

		// Click to username
		await mainPage.clickToUserName();

		// Check that the dropdown menu has opened and there is a logout link.
		await expect(mainPage.locatorDropDownMenu).toBeVisible();
		await expect(mainPage.locatorLogoutLink).toBeVisible();

		// Click logout link
		await mainPage.clickToLogout();

		// Check that the dropdown menu has hidden and the link too.
		await expect(mainPage.locatorDropDownMenu).not.toBeVisible();
		await expect(mainPage.locatorLogoutLink).not.toBeVisible();

		// Check that the .nav-link contains a Sign Up link
		// And check page url
		await expect(mainPage.locatorSignUpLink).toBeVisible();
		await expect(mainPage.locatorLogInLink).toBeVisible();
	});
});
