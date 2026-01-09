import { readFile } from 'node:fs/promises';
import newUser from './generate.user.js';
import { MainPage, RegisterPage } from '../pages/realworld.qa.guru/index.js';

export async function getUserInfo() {
	const json = JSON.parse(
		await readFile('./src/temp_data/userInfo.tmp.json', 'utf-8')
	);
	return json;
}

export async function generateNewUser() {
	return await newUser();
}

export async function registrationUserAndLogout(page) {
	const userInfo = await newUser();

	const mainPage = new MainPage(page);
	const registerPage = new RegisterPage(page);

	await mainPage.open(MainPage.URL);

	if (!mainPage.locatorSignUpLink.isVisible()) {
		await mainPage.clickToUserName();
		await mainPage.clickToLogout();
	}

	// Visit to "Register Page"
	await registerPage.open(RegisterPage.URL);

	// Fill form fields
	await registerPage.fillUserNameField(userInfo.userName);
	await registerPage.fillUserEmailField(userInfo.userEmail);
	await registerPage.fillUserPasswordField(userInfo.userPassword);

	console.log(userInfo);
	console.log(userInfo);
	console.log(userInfo);

	// Submit Register Form after filled fields
	await registerPage.submitForm();
	await mainPage.open(MainPage.URL);

	// Click to username
	await mainPage.clickToUserName();

	// Click logout link
	await mainPage.clickToLogout();

	return userInfo;
}
