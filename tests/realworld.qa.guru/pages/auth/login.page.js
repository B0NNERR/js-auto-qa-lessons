// Импортируем базовый класс
import { BasePage } from '../base.page.js';

// Класс для страницы авторизации
export class LoginPage extends BasePage {
	// Конструктор
	constructor(page) {
		super(page); // Вызываем конструктор родительского класса (BasePage)
		this.url = '/#/login';

		// Текстовые константы (не хардкодим текст в тестах)
		this.texts = {
			pageTitle: 'Sign in',
			buttonText: 'Login',
			errorEmailNotFound: 'Email not found sign in first',
			errorPasswordNotFound: 'Wrong email/password combination',
		};

		// Определяем селекторы для элементов страницы
		this.selectors = {
			pageTitle: `//h1[text()="${this.texts.pageTitle}"]`,
			emailInput: 'input[type="email"]', // Поле email
			passwordInput: 'input[type="password"]', // Поле пароля
			loginButton: `//button[text()="${this.texts.buttonText}"]`, // Кнопка "Login"
			errorMessages: '.error-messages', // Блок ошибок (красный)
			userGreeting: '.dropdown-toggle', // Приветствие пользователя
			registerLink: '.auth-page a[href*="register"]', // Ссылка "Need an account?"
		};
	}
	// --- НАВИГАЦИЯ ---

	async navigate() {
		await super.navigate(this.url); // Переходим на /login
		await this.waitForPageLoad(); // Ждем загрузки
	}

	async waitForPageLoad() {
		// Ждем пока кнопка Login станет видимой
		await this.waitForElement(this.selectors.loginButton);
		await this.waitForElement(this.selectors.pageTitle);
	}

	// --- ОСНОВНЫЕ ДЕЙСТВИЯ ---

	// Заполняем форму логина
	async fillLoginForm(email, password) {
		// Заполняем email
		await this.fillField(this.selectors.emailInput, email);

		// Заполняем пароль
		await this.fillField(this.selectors.passwordInput, password);
	}

	// Полный процесс логина (заполнение + клик)
	async login(email, password) {
		await this.fillLoginForm(email, password);
		await this.clickLogin();
	}

	// Кликаем кнопку Login
	async clickLogin() {
		await this.clickElement(this.selectors.loginButton);
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

	// --- УСПЕШНЫЙ ЛОГИН ---

	// Ждем успешного логина (редирект на главную)
	async waitForSuccessfulLogin() {
		// 1. Ждем редиректа на главную
		// await expect(this.page).toHaveURL(/\/$/);

		await this.page.waitForURL(process.env.BASE_URL);

		// 2. Ждем появления приветствия пользователя
		await this.waitForElement(this.selectors.userGreeting);
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
			return greeting.trim();
		}
		return null;
	}

	// --- ДОПОЛНИТЕЛЬНЫЕ ДЕЙСТВИЯ ---

	// Переход на страницу регистрации
	async goToRegister() {
		await this.clickElement(this.selectors.registerLink);
	}

	// Очистка формы
	async clearForm() {
		await this.fillField(this.selectors.emailInput, '');
		await this.fillField(this.selectors.passwordInput, '');
	}

	// --- ГЕТТЕРЫ ДЛЯ ТЕСТОВ ---

	// Геттер для блока ошибок
	get errorMessages() {
		return this.page.locator(this.selectors.errorMessages);
	}

	// Геттер для кнопки Login
	get loginButton() {
		return this.page.locator(this.selectors.loginButton);
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
