import { browser } from '$app/environment';
import { page } from '$app/stores';
import { get } from 'svelte/store';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type CustomResponse<T extends Record<string, unknown>> = {
	status: number;
	statusText: string;
	json: () => Promise<T>;
	headers: Headers;
};

export class HttpError extends Error {
	public isHttpError = true;

	constructor(
		public status: number,
		public statusText: string,
		public json: () => Promise<Record<string, unknown>>,
		public headers: Headers
	) {
		super(`HTTP Error: ${status} ${statusText}`);
	}

	static fromResponse<T extends Record<string, unknown>>(response: CustomResponse<T>): HttpError {
		return new HttpError(response.status, response.statusText, response.json, response.headers);
	}
}

export class ApiService {
	private readonly fetch: typeof fetch;

	private static baseUrl = import.meta.env.VITE_GATEWAY_URL;

	private get headers() {
		const headers: Headers = new Headers({
			'Content-Type': 'application/json',
			Accept: 'application/json'
		});

		if (this.token) headers.set('Authorization', `Bearer ${this.token}`);

		return headers;
	}

	constructor(_fetch: typeof fetch, private readonly token?: string) {
		this.fetch = _fetch;
		if (!token && browser) this.token = get(page).data.accessToken;
	}

	async request<Res extends Record<string, unknown>, Body extends Record<string, unknown>>(
		method: Method,
		url: string,
		body?: Body
	): Promise<CustomResponse<Res>> {
		const response = await this.fetch(new URL(url, ApiService.baseUrl), {
			method,
			headers: this.headers,
			body: body ? JSON.stringify(body) : undefined
		});

		const customResponse: CustomResponse<Res> = {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			json: response.json.bind(response)
		};

		if (!response.ok) throw HttpError.fromResponse(customResponse);

		return customResponse;
	}

	async get<Res extends Record<string, unknown>>(url: string): Promise<CustomResponse<Res>> {
		return this.request<Res, never>('GET', url);
	}

	async post<
		Res extends Record<string, unknown>,
		Body extends Record<string, unknown> = Record<string, unknown>
	>(url: string, body: Body): Promise<CustomResponse<Res>> {
		return this.request<Res, Body>('POST', url, body);
	}

	async put<Res extends Record<string, unknown>, Body extends Record<string, unknown>>(
		url: string,
		body: Body
	): Promise<CustomResponse<Res>> {
		return this.request<Res, Body>('PUT', url, body);
	}

	async delete<Res extends Record<string, unknown>>(url: string): Promise<CustomResponse<Res>> {
		return this.request<Res, never>('DELETE', url);
	}
}
