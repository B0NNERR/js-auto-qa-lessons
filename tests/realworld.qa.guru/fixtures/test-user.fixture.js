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

// Создаем свой тест с расширенными фикстурами
export const test = base.extend({
	// Фикстура 1: Новый пользователь
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

	// Фикстура 2: Страница регистрации
	registerPage: async ({ page }, use) => {
		// Создаем экземпляр страницы регистрации
		const registerPage = new RegisterPage(page);

		// Передаем его в тест
		await use(registerPage);
	},

	// Фикстура 3: Домашняя страница
	homePage: async ({ page }, use) => {
		const homePage = new HomePage(page);
		await use(homePage);
	},

	loginPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);
		await use(loginPage);
	},
});
