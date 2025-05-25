<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<Navbar />
<div class="content">
	{@render children()}
</div>

<style>
	.content {
		display: flex;
		justify-content: center;
	}
</style>
