import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
	return {
		userJson: locals.user,
		accessToken: locals.accessToken
	};
};
