// Импортируем базовый класс
import { BasePage } from '../base.page.js';

// Класс для страницы регистрации
export class RegisterPage extends BasePage {
	// Конструктор
	constructor(page) {
		super(page); // Вызываем конструктор родительского класса (BasePage)
		this.url = '/#/register';

		this.texts = {
			pageTitle: 'Sign up',
			buttonText: 'Sign up',
			errorEmailExist: 'Email already exists.. try logging in',
		};

		// Определяем селекторы для элементов страницы
		this.selectors = {
			usernameInput: 'input[name="username"]',
			emailInput: 'input[placeholder="Email"]',
			passwordInput: 'input[name="password"]',
			signUpButton: `//button[text()=${this.buttonText}]`,
			errorMessages: '.error-messages', // Блок с ошибками
		};
	}

	// Метод для перехода на страницу регистрации
	async navigate() {
		// Вызываем метод navigate из BasePage с путем "/register"
		await super.navigate(this.url);
	}

	// Метод для заполнения формы регистрации
	async fillRegistrationForm(username, email, password) {
		// Используем методы из BasePage
		await this.fillField(this.selectors.usernameInput, username);
		await this.fillField(this.selectors.emailInput, email);
		await this.fillField(this.selectors.passwordInput, password);
	}

	// Метод для клика по кнопке Sign Up
	async clickSignUp() {
		await this.clickElement(this.selectors.signUpButton);
	}

	// Метод для полной регистрации (заполнение + клик)
	async register(username, email, password) {
		await this.fillRegistrationForm(username, email, password);
		await this.clickSignUp();
	}

	// Метод для очистки формы
	async clearForm() {
		// Очищаем каждое поле
		await this.fillField(this.selectors.usernameInput, '');
		await this.fillField(this.selectors.emailInput, '');
		await this.fillField(this.selectors.passwordInput, '');
	}

	// Геттер для блока ошибок (специальный синтаксис для получения свойств)
	get errorMessages() {
		return this.page.locator(this.selectors.errorMessages);
	}
}
