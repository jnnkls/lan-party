<script lang="ts">
	export let dateIso: string;
	export let endedLabel: string = 'Ended';
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
		border-radius: 3px;
		background: var(--accent);
		color: white;
		padding: 0.45rem 0.7rem;
		font-family: 'Open Sans', system-ui, sans-serif;
		font-size: 0.7rem;
		font-weight: 800;
		line-height: 1.5;
		text-transform: uppercase;
		box-shadow: none;
	}

	.date-badge.ended {
		border-color: var(--border-strong);
		background: linear-gradient(135deg, var(--surface-sunken), var(--surface-muted));
		color: var(--text-muted);
	}
</style>
