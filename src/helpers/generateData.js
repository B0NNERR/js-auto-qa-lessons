import { readFile } from 'node:fs/promises';
import newUser from './generate.user.js';

export async function getUserInfo() {
	const json = JSON.parse(
		await readFile('./src/temp_data/userInfo.tmp.json', 'utf-8')
	);
	return json;
}

export async function generateNewUser() {
	return await newUser();
}
