import { fakerRU } from '@faker-js/faker';
import { writeFile } from 'fs/promises';

export default async () => {
	const userName = fakerRU.person.firstName();
	const userEmail = fakerRU.internet.email({ firstName: userName });
	const userPassword = fakerRU.internet.password({
		length: 12,
	});

	const userInfo = {
		userName,
		userEmail,
		userPassword,
	};

	console.log(
		`Был сгенерирован новый пользователь:
\t User Name: \t ${userInfo.userName}
\t User Email: \t ${userInfo.userEmail}
\t User Password: \t ${userInfo.userPassword}`
	);

	await writeFile(
		'./src/temp_data/userInfo.tmp.json',
		JSON.stringify(userInfo, null, 2),
		'utf-8'
	);

	return userInfo;
};
