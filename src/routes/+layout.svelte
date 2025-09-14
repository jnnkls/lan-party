<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Navbar />
<div class="flex justify-center">
	<div class="max-w-6xl w-full flex flex-col px-4">
		{@render children()}
	</div>
</div>
<ThemeToggle />

