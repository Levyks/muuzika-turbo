import { redirect } from '@sveltejs/kit';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();

	if (get(data.user)) {
		throw redirect(302, '/');
	}
};
