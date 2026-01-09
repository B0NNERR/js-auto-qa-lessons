// Импортируем базовый класс
import { BasePage } from '../base.page.js';

// Класс для страницы авторизации
export class LoginPage extends BasePage {
	// Конструктор
	constructor(page) {
		super(page); // Вызываем конструктор родительского класса (BasePage)
		this.url = '/#/login';

		// Определяем селекторы для элементов страницы
		this.selectors = {
			emailInput: 'input[type="email"]', // Поле email
			passwordInput: 'input[type="password"]', // Поле пароля
			signInButton: 'button[type="submit"]', // Кнопка "Sign In"
			errorMessages: '.error-messages', // Блок ошибок (красный)
			userGreeting: '.navbar .user-info', // Приветствие пользователя
		};

		// Текстовые константы (не хардкодим текст в тестах)
		this.texts = {
			pageTitle: 'Sign in',
			buttonText: 'Login',
			errorEmailNotFound: 'Email not found sign in first',
			errorWrongCombinationFormFields: 'Wrong email/password combination',
		};
	}
	// --- НАВИГАЦИЯ ---

	async navigate() {
		await super.navigate('/#/login'); // Переходим на /login
		await this.waitForPageLoad(); // Ждем загрузки
	}

	async waitForPageLoad() {
		// Ждем пока кнопка Sign in станет видимой
		await this.waitForElement(this.selectors.signInButton);
		// Ждем пока заголовок страницы загрузится
		await expect(this.page).toHaveTitle(new RegExp(this.texts.pageTitle, 'i'));
	}

	// --- ОСНОВНЫЕ ДЕЙСТВИЯ ---

	// Заполняем форму логина
	async fillLoginForm(email, password) {
		// Заполняем email
		await this.fillField(this.selectors.emailInput, email);

		// Заполняем пароль
		await this.fillField(this.selectors.passwordInput, password);
	}

	// Кликаем кнопку Login
	async clickLogIn() {
		await this.clickElement(this.selectors.signInButton);
	}

	// Полный процесс логина (заполнение + клик)
	async login(email, password) {
		await this.fillLoginForm(email, password);
		await this.clickLogin();
	}

	// Логин с ожиданием успешного редиректа
	async loginAndWaitForSuccess(email, password) {
		await this.login(email, password);
		await this.waitForSuccessfulLogin();
	}

	// --- ВАЛИДАЦИЯ И ОШИБКИ ---

	// Проверяем видимость ошибки
	async isErrorVisible() {
		try {
			const error = this.page.locator(this.selectors.errorMessages);
			return await error.isVisible();
		} catch {
			return false;
		}
	}

	// Получаем текст ошибки
	async getErrorText() {
		if (await this.isErrorVisible()) {
			const error = this.page.locator(this.selectors.errorMessages);
			return await error.textContent();
		}
		return '';
	}

	// Проверяем конкретную ошибку
	async hasError(text) {
		const errorText = await this.getErrorText();
		return errorText.includes(text);
	}

	// Проверяем ошибки полей
	async getFieldError(fieldName) {
		switch (fieldName.toLowerCase()) {
			case 'email':
				return this.page.locator(this.selectors.emailError);
			case 'password':
				return this.page.locator(this.selectors.passwordError);
			default:
				throw new Error(`Unknown field: ${fieldName}`);
		}
	}

	// --- УСПЕШНЫЙ ЛОГИН ---

	// Ждем успешного логина (редирект на главную)
	async waitForSuccessfulLogin() {
		// 1. Ждем редиректа на главную
		await expect(this.page).toHaveURL(/\/$/);

		// 2. Ждем появления приветствия пользователя
		await this.waitForElement(this.selectors.userGreeting);

		// 3. Проверяем что пропал блок логина
		await expect(
			this.page.locator(this.selectors.signInButton)
		).not.toBeVisible();
	}

	// Проверяем что пользователь залогинен
	async isUserLoggedIn() {
		try {
			await this.waitForElement(this.selectors.userGreeting, { timeout: 3000 });
			return true;
		} catch {
			return false;
		}
	}

	// Получаем имя залогиненного пользователя
	async getLoggedInUsername() {
		if (await this.isUserLoggedIn()) {
			const greeting = await this.getElementText(this.selectors.userGreeting);
			return greeting.replace('Welcome, ', '').trim();
		}
		return null;
	}

	// --- ДОПОЛНИТЕЛЬНЫЕ ДЕЙСТВИЯ ---

	// Переход на страницу регистрации
	async goToRegister() {
		await this.clickElement(this.selectors.registerLink);
	}

	// Переход на страницу восстановления пароля
	async goToForgotPassword() {
		await this.clickElement(this.selectors.forgotPasswordLink);
	}

	// Очистка формы
	async clearForm() {
		await this.fillField(this.selectors.emailInput, '');
		await this.fillField(this.selectors.passwordInput, '');

		// Снимаем галочку с Remember me если она есть
		const checkbox = this.page.locator(this.selectors.rememberMeCheckbox);
		if (await checkbox.isChecked()) {
			await checkbox.uncheck();
		}
	}

	// --- ГЕТТЕРЫ ДЛЯ ТЕСТОВ ---

	// Геттер для блока ошибок
	get errorMessages() {
		return this.page.locator(this.selectors.errorMessages);
	}

	// Геттер для кнопки Sign In
	get signInButton() {
		return this.page.locator(this.selectors.signInButton);
	}

	// Геттер для поля email
	get emailField() {
		return this.page.locator(this.selectors.emailInput);
	}

	// Геттер для поля password
	get passwordField() {
		return this.page.locator(this.selectors.passwordInput);
	}
}
