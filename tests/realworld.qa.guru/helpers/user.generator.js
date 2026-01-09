import { faker } from '@faker-js/faker';

export class UserGenerator {
	static generateRandomUser() {
		const username = faker.person.firstName();
		const email = faker.internet.email({ provider: 'qa.example.com' });
		const password = faker.internet.password({
			length: 12,
			memorable: false,
			pattern: /[\w\d!@#$%^&*]/,
		});

		return {
			username,
			email,
			password,
			bio: faker.person.bio().substring(0, 100),
			image: faker.image.avatar(),
		};
	}

	static generateArticleData() {
		return {
			title: faker.lorem.words(3),
			description: faker.lorem.sentence(),
			body: faker.lorem.paragraphs(2),
			tagList: [faker.lorem.word(), faker.lorem.word()],
		};
	}
}

// Пример использования:
// const testUser = UserGenerator.generateRandomUser();
// console.log(testUser);
// {
//   username: 'cool_user_42',
//   email: 'cool.user42@qa.example.com',
//   password: 'Pa$$w0rd123!',
//   bio: 'QA engineer with 5 years experience...',
//   image: 'https://avatar.com/user42.png'
// }
