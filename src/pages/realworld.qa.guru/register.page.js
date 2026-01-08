import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
	constructor(page) {
		super(page);

		this.userNameField = page.locator('input[name="username"]');
		this.userEmailField = page.locator('input[name="email"]');
		this.userPasswordField = page.locator('input[name="password"]');
		this.submitFormButton = page.getByRole('button', { name: 'Sign up' });
	}

	async fillUserNameField(userName) {
		await this.userNameField.fill(userName);
	}

	async fillUserEmailField(userEmail) {
		await this.userEmailField.fill(userEmail);
	}

	async fillUserPasswordField(userPassword) {
		await this.userPasswordField.fill(userPassword);
	}

	async submitForm() {
		const userNameFieldValue = await this.userNameField.inputValue();
		const userEmailFieldValue = await this.userEmailField.inputValue();
		const userPasswordFieldValue = await this.userPasswordField.inputValue();
		if (userNameFieldValue && userEmailFieldValue && userPasswordFieldValue) {
			await this.submitFormButton.click();
		} else {
			throw new Error(
				'Can`t fill form fields:' +
					`
				userNameFieldValue: ${userNameFieldValue}
				userEmailFieldValue: ${userEmailFieldValue}
				userPasswordFieldValue: ${userPasswordFieldValue}
				`
			);
		}
	}
}
