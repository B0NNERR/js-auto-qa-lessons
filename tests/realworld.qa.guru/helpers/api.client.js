import { ENV } from '../config/env.js';

export class ApiClient {
	constructor() {
		this.baseURL = ENV.API_URL;
		this.headers = {
			'Content-Type': 'application/json',
		};
	}

	async _request(method, endpoint, data = null, authToken = null) {
		const options = {
			method,
			headers: { ...this.headers },
		};

		if (authToken) {
			options.headers['Authorization'] = `Token ${authToken}`;
		}

		if (data) {
			options.body = JSON.stringify(data);
		}

		const response = await fetch(`${this.baseURL}${endpoint}`, options);
		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(
				`API Error: ${response.status} - ${JSON.stringify(responseData)}`
			);
		}

		return responseData;
	}

	// 🔐 Метод для логина через API
	async registerUser(userData) {
		const payload = {
			user: {
				username: userData.username,
				email: userData.email,
				password: userData.password,
			},
		};
		return await this._request('POST', '/users', payload);
	}

	async login(email, password) {
		const payload = {
			user: { email, password },
		};
		const response = await this._request('POST', '/users/login', payload);
		return response.user.token;
	}

	// 🔐 Метод для получения информации о пользователе
	async getCurrentUser(token) {
		return await this._request('GET', '/user', null, token);
	}

	// 🔐 Метод для выхода
	async logout(token) {
		// В некоторых API есть endpoint для logout
		// Если нет - просто инвалидируем токен на клиенте
		console.log(`Logging out user with token: ${token.substring(0, 10)}...`);
		return true;
	}

	// 🔐 Метод для проверки валидности токена
	async validateToken(token) {
		try {
			await this.getCurrentUser(token);
			return true;
		} catch {
			return false;
		}
	}

	async createArticle(email, password, articleData) {
		const token = await this.login(email, password);
		const payload = { article: articleData };
		return await this._request('POST', '/articles', payload, token);
	}

	async deleteArticle(email, password, slug) {
		const token = await this.login(email, password);
		return await this._request('DELETE', `/articles/${slug}`, null, token);
	}
}
