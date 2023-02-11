import { HttpError } from '$lib/services/api.service';
import { fail, type ActionFailure } from '@sveltejs/kit';
import { ZodError } from 'muuzika-zod';

export async function handleServerSideException(
	ex: unknown
): Promise<ActionFailure<Record<string, unknown>>> {
	if (ex instanceof ZodError) {
		return fail(400, {
			error: 'zod',
			data: ex
		});
	}

	if (ex instanceof HttpError) {
		return fail(502, {
			error: 'remote',
			data: {
				status: ex.status,
				data: await ex.json()
			}
		});
	}

	return fail(500, {
		message: 'Internal Server Error'
	});
}
