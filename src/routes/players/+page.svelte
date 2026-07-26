<script lang="ts">
	import UserCard from '$lib/components/UserCard.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const ranked = $derived(data.players);

	let page = $state(1);
	const pageSize = 8;
	const pageCount = $derived(Math.max(1, Math.ceil(ranked.length / pageSize)));
	$effect(() => {
		if (page > pageCount) page = pageCount;
		if (page < 1) page = 1;
	});
	const pageItems = () => ranked.slice((page - 1) * pageSize, page * pageSize);

	const rankOf = (id: string) => ranked.findIndex((p) => p.id === id) + 1;
</script>

<section class="mt-4">
	<div class="screen-header">
		<div class="flex flex-wrap items-center justify-between gap-4 pb-3">
			<div>
				<div class="quest-tag mb-3">
					<i class="fa-solid fa-users"></i>
					<span>Player Select</span>
				</div>
				<h1>Players</h1>
			</div>
			<div class="flex flex-wrap gap-2">
				<span class="stat-chip"><i class="fa-solid fa-user-group"></i>{ranked.length} players</span>
				<span class="stat-chip"><i class="fa-solid fa-trophy"></i>titles enabled</span>
				<span class="stat-chip"><i class="fa-solid fa-star"></i>XP active</span>
			</div>
		</div>
	</div>

	{#if ranked.length > 0}
		<ul class="grid gap-3">
			{#each pageItems() as p (p.id)}
				<li>
					<UserCard
						id={p.id}
						username={p.username}
						avatarUrl={p.avatarUrl ?? 'https://i.pravatar.cc/100'}
						title={p.title ?? ''}
						rarity={p.rarity ?? 'common'}
						attendanceCount={p.attendanceCount ?? 0}
						winStreak={p.winStreak ?? 0}
						consoleCount={p.consoleCount ?? 0}
						xp={p.xp ?? 0}
						rank={rankOf(p.id)}
					/>
				</li>
			{/each}
		</ul>

		<PaginationControls
			{page}
			{pageCount}
			onPrev={() => (page = Math.max(1, page - 1))}
			onNext={() => (page = Math.min(pageCount, page + 1))}
		/>
	{:else}
		<div class="game-panel p-6 text-[var(--text-muted)]">No players found.</div>
	{/if}
</section>
