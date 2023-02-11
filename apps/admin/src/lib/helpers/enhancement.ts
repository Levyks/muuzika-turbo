export function isJsEnabled(request: Request) {
	return request.headers.has('x-sveltekit-action');
}
