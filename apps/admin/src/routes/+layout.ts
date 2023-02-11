import { writable } from 'svelte/store';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
	return {
		user: writable(data.userJson),
		accessToken: data.accessToken
	};
};
