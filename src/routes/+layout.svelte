<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Navbar />
<main class="app-shell">
	<div class="app-content">
		{@render children()}
	</div>
</main>
<ThemeToggle />
