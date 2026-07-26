<script lang="ts">
	import HomeHero from '$lib/components/HomeHero.svelte';
	import LanCard from '$lib/components/LanCard.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const events = $derived(data.events);

	const upcoming = $derived(
		events
			.filter((e) => new Date(e.date) >= new Date())
			.sort((a, b) => +new Date(a.date) - +new Date(b.date))
	);

	const past = $derived(
		events
			.filter((e) => new Date(e.date) < new Date())
			.sort((a, b) => +new Date(b.date) - +new Date(a.date))
	);

	const live = $derived(events.filter((e) => e.status === 'ongoing'));
	const archived = $derived(
		events.filter((e) => e.status === 'expired' || new Date(e.date) < new Date())
	);
</script>

<HomeHero
	next={upcoming.length > 0 ? upcoming[0] : null}
	liveCount={live.length}
	upcomingCount={upcoming.length}
	archiveCount={archived.length}
/>

<section class="mt-6 grid gap-4 lg:grid-cols-3">
	<a href="/lans" class="command-card text-inherit no-underline">
		<div class="section-kicker">
			<i class="fa-solid fa-ethernet"></i>
			<span>Party Board</span>
		</div>
		<h3 class="mt-2">Join or plan a LAN</h3>
		<p class="mt-2 text-[var(--text-muted)]">
			Live, upcoming, and archived events with games and gear.
		</p>
	</a>
	<a href="/players" class="command-card text-inherit no-underline">
		<div class="section-kicker">
			<i class="fa-solid fa-id-card-clip"></i>
			<span>Roster</span>
		</div>
		<h3 class="mt-2">Browse player cards</h3>
		<p class="mt-2 text-[var(--text-muted)]">Titles, streaks, XP, attendance, and loadouts.</p>
	</a>
	<a href="/leaderboard" class="command-card text-inherit no-underline">
		<div class="section-kicker">
			<i class="fa-solid fa-ranking-star"></i>
			<span>High Scores</span>
		</div>
		<h3 class="mt-2">Check the leaderboard</h3>
		<p class="mt-2 text-[var(--text-muted)]">Podiums and ranked XP for the whole party crew.</p>
	</a>
</section>

<section class="mt-8">
	<div class="mb-4 flex flex-wrap items-center justify-between gap-3">
		<div>
			<div class="quest-tag mb-2">
				<i class="fa-solid fa-scroll"></i>
				<span>Quest Log</span>
			</div>
			<h3>Recent events and happenings</h3>
		</div>
		<div class="stat-chip">
			<i class="fa-solid fa-heart"></i>
			<span>Happy LAN memories</span>
		</div>
	</div>

	{#if past.length > 0}
		<ul class="grid gap-4">
			{#each past as e (e.id)}
				<LanCard lan={e} clickable={true} showStats={false} />
			{/each}
		</ul>
	{:else}
		<div class="game-panel p-6 text-[var(--text-muted)]">
			No past events yet. After your first LAN, highlights will appear here.
		</div>
	{/if}
</section>
