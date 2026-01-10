export class BasePage {
	constructor(page) {
		this.page = page;
		this.timeouts = {
			navigation: 10000,
			element: 5000,
			assertion: 3000,
		};
	}

	async navigate(path = '') {
		const url = `${process.env.BASE_URL || 'https://realworld.qa.guru'}${path}`;
		await this.page.goto(url, {
			waitUntil: 'networkidle',
			timeout: this.timeouts.navigation,
		});
	}

	async waitForElement(selector, options = {}) {
		const element = this.page.locator(selector);
		await element.waitFor({
			state: 'visible',
			timeout: options.timeout || this.timeouts.element,
		});
		return element;
	}

	async fillField(selector, value) {
		const field = await this.waitForElement(selector);
		await field.clear();
		await field.fill(value);
	}

	async clickElement(selector) {
		const element = await this.waitForElement(selector);
		await element.click();
	}

	async getElementText(selector) {
		const element = await this.waitForElement(selector);
		return await element.textContent();
	}

	async takeScreenshot(name) {
		await this.page.screenshot({
			path: `./test-results/screenshots/${name}-${Date.now()}.png`,
			fullPage: true,
		});
	}
}
