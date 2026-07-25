<script lang="ts">
	import DateBadge from './DateBadge.svelte';
	import ImageFill from './ImageFill.svelte';
	import type { LanOverview } from '$lib/types';

	let {
		lan,
		clickable = true,
		showStats = true
	}: {
		lan: LanOverview;
		clickable?: boolean;
		showStats?: boolean;
	} = $props();

	const isJoinable =
		lan.status === 'ongoing' || lan.status === 'future' || new Date(lan.date) >= new Date();
	const actionLabel =
		lan.status === 'expired' ? 'View Recap' : lan.status === 'ongoing' ? 'Join Live' : 'Ready Up';
	const statusLabel =
		lan.status === 'expired' ? 'Archived' : lan.status === 'ongoing' ? 'Live now' : 'Upcoming';
	const statusClass =
		lan.status === 'expired' ? 'expired' : lan.status === 'ongoing' ? '' : 'future';
</script>

<li class="quest-card lan-card">
	{#if clickable}
		<a
			href={`/lans/${lan.id}`}
			aria-label={`Open ${lan.title}`}
			class="absolute inset-0 z-10 block focus:outline focus:outline-2 focus:outline-[var(--accent)]"
			style="outline-offset: -4px;"
		></a>
	{/if}

	<div class="pointer-events-none absolute top-3 right-3 z-10">
		<DateBadge dateIso={lan.date} endedLabel="Cleared" />
	</div>

	<div class="relative flex flex-col sm:grid sm:grid-cols-3">
		<div class="relative h-44 bg-[var(--surface-muted)] sm:col-span-1 sm:h-full">
			<ImageFill src={lan.coverImage} alt={lan.title} />
			<div class="absolute bottom-3 left-3">
				<span class="quest-tag">{actionLabel}</span>
			</div>
		</div>

		<div class="relative flex flex-col gap-3 p-5 pl-6 text-[var(--text)] sm:col-span-2">
			<div class="party-divider"></div>

			<div class="flex flex-wrap items-baseline gap-2">
				<span class="font-display text-sm">{lan.title}</span>
				{#if lan.location}
					<span class="text-xs text-[var(--text-muted)]">at {lan.location}</span>
				{/if}
			</div>

			{#if lan.theme}
				<span class="stat-chip">
					<i class="fa-solid fa-star text-[var(--party-yellow)]"></i>
					{lan.theme}
				</span>
			{/if}

			{#if lan.description}
				<p class="line-clamp-2 text-[var(--text-muted)]">{lan.description}</p>
			{/if}

			<div class="flex flex-wrap gap-2">
				<span class="stat-chip">
					<span class={`status-dot ${statusClass}`}></span>
					{statusLabel}
				</span>
				{#if showStats}
					<span class="stat-chip">
						<i class="fa-solid fa-user-group text-[var(--accent)]"></i>
						{lan.attendees ?? 0} players
					</span>
				{/if}
			</div>

			<div class="flex flex-wrap gap-2">
				{#each (lan.games ?? []).slice(0, 3) as game (game)}
					<span class="stat-chip"><i class="fa-solid fa-gamepad"></i>{game}</span>
				{/each}
				{#if lan.consoleNames?.length}
					<span class="stat-chip"
						><i class="fa-solid fa-plug"></i>{lan.consoleNames.join(' + ')}</span
					>
				{/if}
			</div>

			<div class="mt-auto flex flex-wrap items-center gap-2">
				<span class="stat-chip">
					<i class="fa-solid fa-trophy text-[var(--party-yellow)]"></i>
					Party XP
				</span>
				<span class="stat-chip">
					<i class={`fa-solid ${isJoinable ? 'fa-door-open' : 'fa-film'}`}></i>
					{actionLabel}
				</span>
			</div>
		</div>
	</div>
</li>

<style>
	.lan-card :global(.party-divider) {
		height: 0.3rem;
	}
</style>
