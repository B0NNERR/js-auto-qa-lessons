import { BasePage } from './base.page.js';

export class MainPage extends BasePage {
	#locatorSignUpLink = null;

	constructor(page) {
		super(page);
		this.#locatorSignUpLink = this.page.getByRole('link', { name: 'Sign up' });
		this.locatorPageHeading = this.page.getByRole('heading', {
			name: 'Sign up',
		});
	}

	async goToRegister() {
		await this.#locatorSignUpLink.click();
	}

	set userName(name) {
		this.locatorNavLinkWithUserName = this.page.locator('div.nav-link', {
			hasText: name,
		});
	}
}
