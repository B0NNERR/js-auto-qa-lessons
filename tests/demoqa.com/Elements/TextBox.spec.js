import { test, expect } from '@playwright/test';
import { fakerRU } from '@faker-js/faker';

test('Positive case: Fill form fields and submit form without permanent address', async ({
	page,
}) => {
	// General constants
	const MAIN_PAGE = 'https://demoqa.com/text-box';

	// Faker.js seed settings
	const randomInt = Math.floor(Math.random() * 10) + 1;
	const seed = fakerRU.seed(randomInt);
	const { city, state, streetAddress } = fakerRU.location;

	// Logs for random number and seed
	console.log(`
		RandomInt = ${randomInt}
		Faker.js .seed = ${seed}`);

	// Constants with user information
	const USER_NAME = fakerRU.person.firstName();
	const USER_EMAIL = fakerRU.internet.email({
		firstName: USER_NAME,
		provider: 'gmail.com',
	});
	const USER_ADDRESSES = {
		current: `${city()}, ${state()}, ${streetAddress()}}`,
		permanent: '',
	};

	// Locators for filling fields
	const userNameInput = page.locator('#userName');
	const userEmailInput = page.locator('#userEmail');
	const currentAddressTextArea = page.locator('#currentAddress');
	const permanentAddressTextArea = page.locator('#permanentAddress');

	// Locators for result field
	const nameParagraph = page.locator('p#name');
	const emailParagraph = page.locator('p#email');
	const currentAddressParagraph = page.locator('p#currentAddress');
	const permanentAddressParagraph = page.locator('p#permanentAddress');

	// Buttons locators
	const submitButton = page.getByRole('button', { name: 'Submit' });

	// Go to page main page for this test
	await page.goto(MAIN_PAGE);

	// Fill page form fields
	await userNameInput.fill(USER_NAME);
	await userEmailInput.fill(USER_EMAIL);
	await currentAddressTextArea.fill(USER_ADDRESSES.current);
	await permanentAddressTextArea.fill(USER_ADDRESSES.permanent);

	// Asserts for every field and buttons
	await expect(userNameInput).toBeVisible();
	await expect(userNameInput).toHaveValue(USER_NAME);

	await expect(userEmailInput).toBeVisible();
	await expect(userEmailInput).toHaveValue(USER_EMAIL);

	await expect(currentAddressTextArea).toBeVisible();
	await expect(currentAddressTextArea).toHaveValue(USER_ADDRESSES.current);

	await expect(permanentAddressTextArea).toBeVisible();
	await expect(permanentAddressTextArea).toHaveValue(USER_ADDRESSES.permanent);

	await expect(submitButton).toBeVisible();

	// Submit form
	await submitButton.click();

	// Assert for main expected result
	if (USER_NAME) {
		await expect(nameParagraph).toBeVisible();
		await expect(nameParagraph).toHaveText(`Name:${USER_NAME}`);
	}

	if (USER_EMAIL) {
		await expect(emailParagraph).toBeVisible();
		await expect(emailParagraph).toHaveText(`Email:${USER_EMAIL}`);
	}

	if (USER_ADDRESSES.current) {
		await expect(currentAddressParagraph).toBeVisible();
		await expect(currentAddressParagraph).toHaveText(
			`Current Address :${USER_ADDRESSES.current}`
		);
	}

	if (USER_ADDRESSES.permanent) {
		await expect(permanentAddressParagraph).toBeVisible();
		await expect(permanentAddressParagraph).toHaveText(
			`Permananet Address :${USER_ADDRESSES.permanent}`
		);
	}
});
