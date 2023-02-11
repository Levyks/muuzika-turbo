// See https://kit.svelte.dev/docs/types#app

import type { UserDto } from 'muuzika-zod';
import type { Writable } from 'svelte/store';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: UserDto;
			accessToken?: string;
		}
		interface PageData {
			user: Writable<UserDto | undefined>;
			accessToken?: string;
		}
		// interface Platform {}
	}
}

export {};
