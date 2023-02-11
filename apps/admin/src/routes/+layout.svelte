<script>
	import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';
	import '@skeletonlabs/skeleton/styles/all.css';
	import '../app.postcss';
	import { AppShell } from '@skeletonlabs/skeleton';
	import AppBar from '$lib/components/layout/AppBar.svelte';
</script>

<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<AppBar slot="header" />
	<div class="h-full container mx-auto p-8 space-y-8">
		<slot />
	</div>
</AppShell>
