<script lang="ts">
	import logo from '$lib/assets/img/logo.svg';
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import type { LoginResponseDto } from 'muuzika-zod';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import IoMdEye from 'svelte-icons/io/IoMdEye.svelte';

	let loading = false;

	const submitEnhancement: SubmitFunction<LoginResponseDto> = () => {
		loading = true;

		return ({ result, update }) => {
			if (result.type === 'success' && result.data?.user) {
				$page.data.user.set(result.data.user);
				goto('/');
			} else if (result.type === 'error') {
				console.log(result.error);
			}

			loading = false;
		};
	};
</script>

<div class="card rounded-lg relative">
	<div
		class="
			p-4 md:p-6 lg:p-8
			flex justify-center items-center flex-wrap
			gap-6 md:gap-8
		"
	>
		<img
			src={logo}
			alt="Muuzika's logo"
			class="
			h-auto
			w-48 md:w-64
		"
		/>
		<div class="my-2">
			<form method="POST" action="/login" use:enhance={submitEnhancement}>
				<h2 class="text-center mb-3">Login</h2>
				<div>
					<label class="label mb-3">
						<span>E-mail</span>
						<input name="email" type="email" class="input" required />
					</label>
					<label class="label mb-5">
						<span>Password</span>
						<input name="password" type="password" class="input" required />
						<IoMdEye />
					</label>
				</div>
				<button class="btn variant-filled-primary w-full" type="submit">Login</button>
			</form>
		</div>
	</div>
	{#if loading}
		<ProgressBar
			rounded="rounded-b"
			track="absolute bottom-0 left-0 right-0 bg-surface-300 dark:bg-surface-700"
			meter="bg-primary-700-200-token"
		/>
	{/if}
</div>
