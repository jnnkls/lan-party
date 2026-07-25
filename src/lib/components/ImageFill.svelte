<script lang="ts">
	export let src: string | undefined = undefined;
	export let alt: string = '';
	export let fallbackText: string = 'No image';
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
