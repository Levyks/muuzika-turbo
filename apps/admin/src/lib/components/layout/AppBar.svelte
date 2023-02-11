<script lang="ts">
	import { AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import LogoutButton from '../auth/LogoutButton.svelte';
</script>

<AppBar slotTrail="place-content-end">
	<a href="/"><h2>Muuzika</h2></a>
	<svelte:fragment slot="trail">
		<LightSwitch />
		<LogoutButton />
	</svelte:fragment>
</AppBar>
