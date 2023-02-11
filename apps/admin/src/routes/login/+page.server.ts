import { redirect } from '@sveltejs/kit';
import { zodLoginDto } from 'muuzika-zod';
import { AuthService } from '$lib/services/auth.service';
import { handleServerSideException } from '$lib/helpers/exceptions';
import { isJsEnabled } from '$lib/helpers/enhancement';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async ({ fetch, request, cookies }) => {
		const data = await request.formData();

		const authService = AuthService.fromFetch(fetch);

		try {
			const payload = zodLoginDto.parse({
				email: data.get('email'),
				password: data.get('password')
			});

			const response = await authService.login(payload);

			cookies.set('access_token', response.accessToken, {
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production'
			});

			if (isJsEnabled(request)) return response;
		} catch (ex) {
			return await handleServerSideException(ex);
		}

		throw redirect(302, '/');
	}
};
