import { BasePage } from './base.page.js';

export class MainPage extends BasePage {
	static URL = 'https://realworld.qa.guru/#/';

	constructor(page) {
		super(page);
		this.locatorSignUpLink = this.page.getByRole('link', { name: 'Sign up' });
		this.locatorLogInLink = this.page.getByRole('link', { name: 'Login' });
		this.locatorPageHeading = this.page.getByRole('heading');
		this.locatorNavLinkWithUserName = this.page.locator('div.dropdown-toggle');
		this.locatorDropDownMenu = this.page.locator('div.dropdown-menu');
		this.locatorLogoutLink = this.page.getByRole('link', { name: 'Logout' });
	}

	async goToRegister() {
		await this.locatorSignUpLink.click();
	}

	async goToLogin() {
		await this.locatorLogInLink.click();
	}

	async clickToUserName() {
		await this.locatorNavLinkWithUserName.click();
	}

	async clickToLogout() {
		this.locatorLogoutLink.click();
	}
}
