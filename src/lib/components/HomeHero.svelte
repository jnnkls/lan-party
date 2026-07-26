<script lang="ts">
	import ImageFill from './ImageFill.svelte';
	import type { LanEvent } from '$lib/types';

	let {
		next = null,
		liveCount = 0,
		upcomingCount = 0,
		archiveCount = 0
	}: {
		next?: LanEvent | null;
		liveCount?: number;
		upcomingCount?: number;
		archiveCount?: number;
	} = $props();

	const formatDate = (date: string) =>
		new Date(date).toLocaleString(undefined, {
			weekday: 'short',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
</script>

<section class="game-panel hero-panel mt-4">
	{#if next}
		<div class="relative z-10 grid gap-6 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-7">
			<div class="flex flex-col gap-5">
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div class="quest-tag">
						<i class="fa-solid fa-satellite-dish"></i>
						<span>LAN Party Campaign</span>
					</div>
					<div class="stat-chip">
						<span class="status-dot future"></span>
						<span>Next event locked</span>
					</div>
				</div>

				<div class="space-y-3">
					<h1 class="font-display">Keep LAN nights alive</h1>
					<p class="max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
						A shared hub for the next session, the people who show up, the score history, and the
						archive of every night worth remembering.
					</p>
				</div>

				<div class="grid gap-3 sm:grid-cols-3">
					<div class="metric-card">
						<span>Live</span>
						<strong>{liveCount}</strong>
					</div>
					<div class="metric-card">
						<span>Upcoming</span>
						<strong>{upcomingCount}</strong>
					</div>
					<div class="metric-card">
						<span>Archive</span>
						<strong>{archiveCount}</strong>
					</div>
				</div>

				<div class="command-card">
					<div class="party-divider mb-4"></div>
					<div class="flex flex-wrap items-start justify-between gap-3">
						<div>
							<div class="section-kicker">
								<i class="fa-solid fa-bolt"></i>
								<span>Next LAN</span>
							</div>
							<h2 class="mt-2">{next.title}</h2>
							{#if next.description}
								<p class="mt-2 text-[var(--text-muted)]">{next.description}</p>
							{/if}
						</div>
						<div class="flex flex-wrap gap-2">
							<span class="stat-chip"
								><i class="fa-regular fa-calendar"></i>{formatDate(next.date)}</span
							>
							{#if next.location}
								<span class="stat-chip"
									><i class="fa-solid fa-location-dot"></i>{next.location}</span
								>
							{/if}
						</div>
					</div>
				</div>

				<div class="flex flex-wrap gap-3">
					<a href={`/lans/${next.id}`} class="button !bg-[var(--accent)] !text-[var(--on-accent)]">
						<i class="fa-solid fa-door-open mr-2"></i>Join event
					</a>
					<a href="/lans" class="button">
						<i class="fa-solid fa-map mr-2"></i>View all LANs
					</a>
				</div>
			</div>

			<div class="hero-console">
				<div class="party-divider"></div>
				<div class="relative flex-1">
					<ImageFill src={next.coverImage} alt={next.title} />
				</div>
				<div
					class="grid grid-cols-3 gap-2 border-t border-[var(--border)] bg-[var(--surface)] p-3 text-center"
				>
					<div>
						<div class="font-display text-[0.65rem] text-[var(--accent-strong)]">XP</div>
						<div class="text-sm font-bold">+250</div>
					</div>
					<div>
						<div class="font-display text-[0.65rem] text-[var(--party-blue)]">CO-OP</div>
						<div class="text-sm font-bold">ON</div>
					</div>
					<div>
						<div class="font-display text-[0.65rem] text-[var(--party-green)]">READY</div>
						<div class="text-sm font-bold">YES</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="relative z-10 p-6 sm:p-10">
			<div class="quest-tag mb-4">
				<i class="fa-solid fa-plus"></i>
				<span>New Quest Needed</span>
			</div>
			<h1 class="font-display">LAN Party Hub</h1>
			<div
				class="mt-4 rounded-xl border border-dashed border-[var(--border)] p-6 text-[var(--text-muted)]"
			>
				No upcoming events yet. Create one on the LANs page.
			</div>
		</div>
	{/if}
</section>

<style>
	.hero-panel {
		background:
			linear-gradient(105deg, color-mix(in srgb, var(--accent) 26%, transparent), transparent 44%),
			linear-gradient(180deg, rgba(255, 255, 255, 0.07), transparent 26rem), var(--surface);
	}

	.hero-panel :global(.font-display) {
		text-wrap: balance;
	}

	.hero-console {
		position: relative;
		z-index: 1;
		display: flex;
		min-height: 24rem;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--border-strong);
		border-radius: 4px;
		background: var(--surface-muted);
		box-shadow: var(--shadow);
	}
</style>
