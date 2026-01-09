import { BasePage } from './base.page';

export class LoginPage extends BasePage {
	static URL = 'https://realworld.qa.guru/#/login';

	constructor(page) {
		super(page);
		this.userEmailField = page.locator('input[name="email"]');
		this.userPasswordField = page.locator('input[name="password"]');
		this.submitFormButton = page.getByRole('button', { name: 'Login' });
	}

	async fillUserEmailField(userEmail) {
		await this.userEmailField.fill(userEmail);
	}

	async fillUserPasswordField(userPassword) {
		await this.userPasswordField.fill(userPassword);
	}

	async submitForm() {
		const userEmailFieldValue = await this.userEmailField.inputValue();
		const userPasswordFieldValue = await this.userPasswordField.inputValue();
		if (userEmailFieldValue && userPasswordFieldValue) {
			await this.submitFormButton.click();
		} else {
			throw new Error(
				'Can`t fill form fields:' +
					`
				userEmailFieldValue: ${userEmailFieldValue}
				userPasswordFieldValue: ${userPasswordFieldValue}
				`
			);
		}
	}
}
