// Импортируем наш кастомный test и expect
import { test, expect } from '../../fixtures/test-user.fixture.js';

// Группируем тесты по функциональности
test.describe('Регистрация нового пользователя', () => {
	// Тест 1: Успешная регистрация
	test('Успешная регистрация со случайными данными', async ({
		registerPage, // Получаем фикстуру registerPage
		newUser, // Получаем фикстуру newUser (случайные данные)
		page, // Получаем стандартную фикстуру page от Playwright
	}) => {
		// ARRANGE (Подготовка)
		console.log('Начинаем тест с пользователем:', newUser.email);
		await registerPage.navigate(); // Переходим на страницу регистрации

		// ACT (Действие)
		await registerPage.register(
			newUser.username,
			newUser.email,
			newUser.password
		);

		// ASSERT (Проверка)

		// 3. Проверяем URL после регистрации
		await expect(page).toHaveURL('/#/'); // URL должен содержать "/#/"

		console.log('Тест пройден успешно!');
	});

	// Тест 2: Регистрация с существующим email
	test('Ошибка при регистрации с существующим email', async ({
		registerPage,
		newUser,
	}) => {
		// Подготовка
		await registerPage.navigate();

		// Первая регистрация (успешная)
		await registerPage.register(
			newUser.username,
			newUser.email,
			newUser.password
		);

		// Ждем редирект на главную
		await expect(registerPage.page).toHaveURL('/#/');

		// Переходим обратно на регистрацию
		await registerPage.navigate();

		// Пытаемся зарегистрировать того же пользователя с другим username
		await registerPage.register(
			'different_username',
			newUser.email, // Тот же email!
			'differentPassword123'
		);

		// Проверяем ошибку
		await expect(registerPage.errorMessages).toBeVisible();
		await expect(registerPage.errorMessages).toContainText(
			registerPage.texts.errorEmailExist
		);
	});

	// Тест 3: Валидация полей
	test('Проверка валидации полей формы', async ({ registerPage }) => {
		await registerPage.navigate();

		// Массив тестовых случаев
		const testCases = [
			{
				username: '',
				email: 'test@test.com',
				password: 'pass123',
				expectedError: 'username',
			},
			{
				username: 'test',
				email: 'invalid-email',
				password: 'pass123',
				expectedError: 'email',
			},
			{
				username: 'test',
				email: 'test@test.com',
				password: '123',
				expectedError: 'password',
			},
		];

		// Проходим по всем тестовым случаям
		for (const testCase of testCases) {
			console.log(`Тестируем: ${testCase.expectedError} валидация`);

			// Заполняем форму
			await registerPage.register(
				testCase.username,
				testCase.email,
				testCase.password
			);

			// Проверяем ошибку
			const errorElement = await registerPage.successMessage;
			await expect(errorElement).not.toBeVisible();
			await expect(registerPage.page).toHaveURL(registerPage.url);

			// Очищаем форму для следующего теста
			await registerPage.clearForm();
		}
	});
});

// Структура теста:
// 1. test.describe - группа связанных тестов
// 2. test - отдельный тестовый случай
// 3. async ({ фикстуры }) - получаем фикстуры как параметры
// 4. Arrange-Act-Assert паттерн
