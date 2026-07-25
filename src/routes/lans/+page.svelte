<script lang="ts">
	import LanCard from '$lib/components/LanCard.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import type { PageProps } from './$types';

	type LanStatus = 'ongoing' | 'future' | 'expired';

	let { data }: PageProps = $props();
	const lans = $derived(data.lans);

	const sorted = $derived([...lans].sort((a, b) => +new Date(b.date) - +new Date(a.date)));
	const grouped = (status: LanStatus) => sorted.filter((lan) => lan.status === status);

	let page = $state(1);
	const pageSize = 6;
	const pageCount = $derived(Math.max(1, Math.ceil(sorted.length / pageSize)));
	$effect(() => {
		if (page > pageCount) page = pageCount;
		if (page < 1) page = 1;
	});
	const visibleIds = () =>
		new Set(sorted.slice((page - 1) * pageSize, page * pageSize).map((lan) => lan.id));

	const sections: { status: LanStatus; label: string; icon: string; hint: string }[] = [
		{
			status: 'ongoing',
			label: 'Live LANs',
			icon: 'fa-tower-broadcast',
			hint: 'Join now, sync up, and see who is already there.'
		},
		{
			status: 'future',
			label: 'Upcoming Quests',
			icon: 'fa-calendar-plus',
			hint: 'Ready up for future parties and tournament plans.'
		},
		{
			status: 'expired',
			label: 'Cleared Runs',
			icon: 'fa-flag-checkered',
			hint: 'Browse history, winners, attendance and recaps.'
		}
	];
</script>

<section class="screen-header">
	<div class="flex flex-wrap items-center justify-between gap-4 pb-3">
		<div>
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-ethernet"></i>
				<span>Party Board</span>
			</div>
			<h1>LANs</h1>
		</div>
		<div class="flex flex-wrap gap-2">
			<span class="stat-chip"
				><i class="fa-solid fa-tower-broadcast"></i>{grouped('ongoing').length} live</span
			>
			<span class="stat-chip"
				><i class="fa-solid fa-calendar"></i>{grouped('future').length} upcoming</span
			>
			<span class="stat-chip"
				><i class="fa-solid fa-scroll"></i>{grouped('expired').length} archived</span
			>
		</div>
	</div>
</section>

{#if sorted.length > 0}
	{#each sections as section (section.status)}
		{@const items = grouped(section.status).filter((lan) => visibleIds().has(lan.id))}
		<section class="arcade-section">
			<div class="arcade-section-title">
				<div>
					<div class="quest-tag mb-2">
						<i class={`fa-solid ${section.icon}`}></i>
						<span>{section.label}</span>
					</div>
					<p class="text-[var(--text-muted)]">{section.hint}</p>
				</div>
				<span class="stat-chip">{grouped(section.status).length} parties</span>
			</div>

			{#if items.length > 0}
				<ul class="grid gap-4">
					{#each items as lan (lan.id)}
						<LanCard {lan} />
					{/each}
				</ul>
			{:else}
				<div class="game-panel p-5 text-[var(--text-muted)]">
					No {section.label.toLowerCase()} on this page.
				</div>
			{/if}
		</section>
	{/each}

	<PaginationControls
		{page}
		{pageCount}
		onPrev={() => (page = Math.max(1, page - 1))}
		onNext={() => (page = Math.min(pageCount, page + 1))}
	/>
{:else}
	<div class="game-panel p-6 text-[var(--text-muted)]">No LANs found.</div>
{/if}
