<script lang="ts">
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import type { LoginResponseDto } from 'muuzika-zod';
	import { goto } from '$app/navigation';

	const submitEnhancement: SubmitFunction<LoginResponseDto> = () => {
		return ({ result, update }) => {
			if (result.type === 'success') {
				$page.data.user.set(null);
				goto('/');
			}

			update();
		};
	};
</script>

<form method="POST" action="/logout" use:enhance={submitEnhancement}>
	<button class="btn variant-filled-primary" type="submit">Logout</button>
</form>
