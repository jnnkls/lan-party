<script lang="ts">
	let { dateIso, endedLabel = 'Ended' }: { dateIso: string; endedLabel?: string } = $props();
	const now = new Date();
	const isEnded = (iso: string) => new Date(iso) < now;
	const formatDate = (iso: string) =>
		new Date(iso).toLocaleString(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
</script>

<span class={isEnded(dateIso) ? 'date-badge ended' : 'date-badge'}>
	{#if isEnded(dateIso)}
		{endedLabel}
	{:else}
		{formatDate(dateIso)}
	{/if}
</span>

<style>
	.date-badge {
		display: inline-flex;
		align-items: center;
		border: 1px solid color-mix(in srgb, var(--accent) 45%, var(--border-strong));
		border-radius: 2px;
		background: var(--accent);
		color: var(--on-accent);
		padding: 0.45rem 0.7rem;
		font-family: 'Press Start 2P', 'Open Sans', system-ui, sans-serif;
		font-size: 0.58rem;
		font-weight: 400;
		line-height: 1.6;
		text-transform: uppercase;
		box-shadow: none;
	}

	.date-badge.ended {
		border-color: var(--border-strong);
		background: linear-gradient(135deg, var(--surface-sunken), var(--surface-muted));
		color: var(--text-muted);
	}
</style>
