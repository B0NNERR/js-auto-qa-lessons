// Импортируем базовый test из Playwright
import { test as base } from '@playwright/test';
// Экспортируем expect для проверок
export { expect } from '@playwright/test';
// Импортируем наши Page Objects
import { RegisterPage } from '../pages/auth/register.page.js';
import { HomePage } from '../pages/home.page.js';
// Импортируем генератор
import { LoginPage } from '../pages/auth/login.page.js';
import { UserGenerator } from '../helpers/user.generator.js';
import { ApiClient } from '../helpers/api.client.js';

// Создаем свой тест с расширенными фикстурами
export const test = base.extend({
	// 🔐 ФИКСТУРА: Новый пользователь
	newUser: async ({}, use) => {
		// Этот код выполняется ДО теста

		// 1. Генерируем случайного пользователя
		const userData = UserGenerator.generateRandomUser();
		console.log('Сгенерирован пользователь:', userData.email);

		// 2. Передаем данные в тест
		await use(userData);

		// Этот код выполняется ПОСЛЕ теста
		console.log('Тест завершен, пользователь:', userData.email);
	},

	// 🔐 ФИКСТУРА: Страница регистрации
	registerPage: async ({ page }, use) => {
		// Создаем экземпляр страницы регистрации
		const registerPage = new RegisterPage(page);

		// Передаем его в тест
		await use(registerPage);
	},

	// 🔐 ФИКСТУРА: Домашняя страница
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await use(homePage);
	},

	// 🔐 ФИКСТУРА: Страница авторизации
	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await use(loginPage);
	},

	// 🔐 ФИКСТУРА: Залогиненный пользователь (через UI)
	loggedInUserUI: async ({ page, newUser, loginPage }, use) => {
		// Шаг 1: Переходим на страницу логина
		await loginPage.navigate();

		// Шаг 2: Логинимся с нашими данными
		await loginPage.loginAndWaitForSuccess(newUser.email, newUser.password);

		// Шаг 3: Проверяем что залогинились успешно
		const username = await loginPage.getLoggedInUsername();
		console.log(`Пользователь ${username} успешно залогинен через UI`);

		// Шаг 4: Передаем данные пользователя в тест
		await use(newUser);

		// Шаг 5: После теста - логаут
		const homePage = new HomePage(page);
		await homePage.logout();
	},

	// 🔐 ФИКСТУРА: Залогиненный пользователь (через API - быстрее)
	loggedInUserAPI: async ({ newUser }, use) => {
		const apiClient = new ApiClient();

		// Логинимся через API и получаем токен
		const token = await apiClient.login(newUser.email, newUser.password);

		// Создаем объект пользователя с токеном
		const userWithToken = {
			...newUser,
			token: token,
		};

		console.log(`Пользователь ${newUser.email} залогинен через API`);
		await use(userWithToken);

		// После теста можно очистить сессию если нужно
		// await apiClient.logout(token);
	},

	// 🔐 ФИКСТУРА: Предзарегистрированный пользователь
	existingUser: async ({}, use) => {
		const apiClient = new ApiClient();
		const userData = UserGenerator.generateRandomUser();

		// Регистрируем пользователя через API
		await apiClient.registerUser(userData);
		console.log(`Создан существующий пользователь: ${userData.email}`);

		await use(userData);

		// После теста удаляем пользователя
		// await apiClient.deleteUser(userData.email);
	},
});
