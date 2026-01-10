// 📋 СОВЕТЫ ДЛЯ LOGIN ТЕСТОВ:
// 1. Всегда тестируйте позитивные и негативные сценарии
// 2. Проверяйте безопасность (скрытие пароля, защита от brute-force)
// 3. Тестируйте "крайние случаи" (очень длинные пароли, спецсимволы)
// 4. Используйте разные фикстуры для разных типов пользователей
// 5. Тестируйте UI состояние после успешного/неуспешного логина

import { test, expect } from '../../fixtures/test-user.fixture.js';

test.describe('Авторизация пользователя (Login Page)', () => {
	// 📌 ТЕСТ 1: Успешный логин с валидными данными
	test('Успешный вход с корректными учетными данными', async ({
		loginPage,
		existingUser, // Используем существующего пользователя
		page,
	}) => {
		// ARRANGE
		console.log('Тест 1: Логин существующего пользователя', existingUser.email);
		await loginPage.navigate();
		// ACT
		await loginPage.loginAndWaitForSuccess(
			existingUser.email,
			existingUser.password
		);

		// ASSERT
		// 1. Проверяем URL (должны быть на главной)
		await expect(page).toHaveURL(/\/#\/$/i);

		// 2. Проверяем что пользователь залогинен
		const isLoggedIn = await loginPage.isUserLoggedIn();
		expect(isLoggedIn).toBe(true);

		// 3. Проверяем отображение имени пользователя
		const displayedUsername = await loginPage.getLoggedInUsername();
		expect(displayedUsername).toBe(existingUser.username);

		// 4. Проверяем что форма логина скрыта
		await expect(loginPage.loginButton).not.toBeVisible();

		console.log('✅ Тест 1 пройден: Пользователь успешно залогинен');
	});

	// 📌 ТЕСТ 2: Неуспешный логин с неверным паролем
	test('Ошибка при вводе неверного пароля', async ({
		loginPage,
		existingUser,
	}) => {
		// ARRANGE
		await loginPage.navigate();

		// ACT: Вводим правильный email, но неправильный пароль
		await loginPage.login(
			existingUser.email,
			'WRONG_PASSWORD_123!' // Неверный пароль
		);

		// ASSERT
		// 1. Проверяем что остались на странице логина
		await expect(loginPage.page).toHaveURL(/\/login/);

		// 2. Проверяем появление ошибки
		await expect(loginPage.errorMessages).toBeVisible();

		// 3. Проверяем текст ошибки
		const errorText = await loginPage.getErrorText();
		expect(errorText).toContain(loginPage.texts.errorPasswordNotFound);

		// 4. Проверяем что кнопка логина все еще видна
		await expect(loginPage.loginButton).toBeVisible();

		console.log('✅ Тест 2 пройден: Ошибка при неверном пароле');
	});

	// 📌 ТЕСТ 3: Неуспешный логин с неверным email
	test('Ошибка при вводе несуществующего email', async ({ loginPage }) => {
		// ARRANGE
		await loginPage.navigate();
		const fakeEmail = 'nonexistent@example.com';

		// ACT
		await loginPage.login(fakeEmail, 'any_password_123');

		// ASSERT
		await expect(loginPage.errorMessages).toBeVisible();
		await expect(loginPage.errorMessages).toContainText(
			loginPage.texts.errorEmailNotFound
		);

		console.log('✅ Тест 3 пройден: Ошибка при несуществующем email');
	});

	// 📌 ТЕСТ 4: Валидация пустых полей
	test('Валидация обязательных полей формы', async ({ loginPage }) => {
		await loginPage.navigate();

		// Тест 4.1: Пустой email
		await loginPage.fillLoginForm('', 'password123');
		await loginPage.clickLogin();

		// Проверяем что остались на той же странице и что поле обязательное
		await expect(loginPage.page).toHaveURL(/\/#\/login$/);
		await expect(loginPage.emailField).toHaveAttribute('required');

		// Тест 4.2: Пустой пароль
		await loginPage.clearForm();
		await loginPage.fillLoginForm('test@example.com', '');
		await loginPage.clickLogin();

		await expect(loginPage.page).toHaveURL(/\/#\/login$/);
		await expect(loginPage.passwordField).toHaveAttribute('required');

		// Тест 4.3: Оба поля пустые
		await loginPage.clearForm();
		await loginPage.clickLogin();

		await expect(loginPage.page).toHaveURL(/\/#\/login$/);

		console.log('✅ Тест 4 пройден: Валидация пустых полей');
	});

	// 📌 ТЕСТ 5: Навигационные ссылки
	test('Проверка навигационных ссылок на странице', async ({
		loginPage,
		page,
	}) => {
		await loginPage.navigate();

		// 6.1: Ссылка "Need an account?" ведет на регистрацию
		await loginPage.goToRegister();
		await expect(page).toHaveURL(/\/register$/);

		console.log('✅ Тест 5 пройден: Навигационные ссылки работают');
	});

	// 📌 ТЕСТ 6: Безопасность - пароль скрыт звездочками
	test('Пароль должен быть скрыт при вводе', async ({ loginPage }) => {
		await loginPage.navigate();

		// Вводим пароль
		const password = 'MySecretPassword123';
		await loginPage.passwordField.fill(password);

		// Проверяем тип поля
		const fieldType = await loginPage.passwordField.getAttribute('type');
		expect(fieldType).toBe('password'); // Должно быть 'password', а не 'text'

		// Проверяем что значение не отображается как текст
		const displayedValue = await loginPage.passwordField.inputValue();
		expect(displayedValue).toBe(password); // Значение есть, но оно скрыто

		console.log('✅ Тест 6 пройден: Пароль скрыт');
	});

	// 📌 ТЕСТ 7: Несколько неудачных попыток входа
	test('Ограничение при множественных неудачных попытках входа', async ({
		loginPage,
		existingUser,
	}) => {
		await loginPage.navigate();

		// 3 неудачные попытки
		for (let i = 1; i <= 3; i++) {
			console.log(`Неудачная попытка ${i}...`);
			await loginPage.login(existingUser.email, `wrong_pass_${i}`);

			// После каждой попытки проверяем ошибку
			await expect(loginPage.errorMessages).toBeVisible();
			await loginPage.clearForm();
		}

		// После 3х попыток проверяем дополнительное сообщение
		const errorText = await loginPage.getErrorText();
		expect(errorText).toContain(loginPage.texts.errorPasswordNotFound);

		console.log('✅ Тест 7 пройден: Ограничение при множественных попытках');
	});
});
