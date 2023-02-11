import { ApiService, HttpError } from '$lib/services/api.service';
import { AuthService } from '$lib/services/auth.service';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('access_token');
	event.locals.accessToken = token;

	const apiService = new ApiService(event.fetch, token);

	const authService = new AuthService(apiService);

	const user = await authService.whoAmI().catch((ex: unknown) => {
		if (ex instanceof HttpError && ex.status === 401) return undefined;
		throw ex;
	});

	event.locals.user = user;

	return resolve(event);
};
