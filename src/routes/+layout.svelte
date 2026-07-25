<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<Navbar user={data.user} />
<main class="app-shell">
	<div class="app-content">
		{@render children()}
	</div>
</main>
<ThemeToggle />
