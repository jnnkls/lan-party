<script lang="ts">
	let {
		src = undefined,
		alt = '',
		fallbackText = 'No image'
	}: {
		src?: string;
		alt?: string;
		fallbackText?: string;
	} = $props();
</script>

<div class="relative h-full w-full overflow-hidden bg-[var(--surface-muted)]">
	{#if src}
		<img class="absolute inset-0 h-full w-full object-cover" {src} {alt} />
	{:else}
		<div class="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
			{fallbackText}
		</div>
	{/if}
</div>
