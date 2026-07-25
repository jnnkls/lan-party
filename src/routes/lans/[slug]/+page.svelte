<script lang="ts">
	import type { PageProps } from './$types';
	import type { LanDetail } from '$lib/types';

	let { data }: PageProps = $props();
	const lan: LanDetail = data.lan as LanDetail;

	const formatDate = (iso: string) =>
		new Date(iso).toLocaleString(undefined, {
			year: 'numeric',
			month: 'short',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});

	const statusLabel =
		lan.status === 'ongoing'
			? 'Live now'
			: lan.status === 'expired'
				? 'Archived recap'
				: 'Upcoming';
	const statusClass =
		lan.status === 'ongoing' ? '' : lan.status === 'expired' ? 'expired' : 'future';
</script>

<section class="screen-header">
	<div class="flex flex-wrap items-center justify-between gap-4 pb-3">
		<div>
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-ethernet"></i>
				<span>{statusLabel}</span>
			</div>
			<h1>{lan.title}</h1>
		</div>
		<div class="flex flex-wrap gap-2">
			<span class="stat-chip">
				<span class={`status-dot ${statusClass}`}></span>
				{statusLabel}
			</span>
			<span class="stat-chip"><i class="fa-regular fa-calendar"></i>{formatDate(lan.date)}</span>
			<span class="stat-chip"><i class="fa-solid fa-user-group"></i>{lan.attendees} attending</span>
			{#if lan.location}
				<span class="stat-chip"><i class="fa-solid fa-location-dot"></i>{lan.location}</span>
			{/if}
		</div>
	</div>
</section>

<section class="game-panel mt-4 overflow-hidden">
	<div class="relative z-10 grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
		<div class="relative min-h-72 bg-[var(--surface-muted)]">
			{#if lan.coverImage}
				<img
					src={lan.coverImage}
					alt={lan.title}
					class="absolute inset-0 h-full w-full object-cover"
				/>
			{:else}
				<div class="flex h-full min-h-72 items-center justify-center text-[var(--text-muted)]">
					No cover image
				</div>
			{/if}
		</div>
		<div class="flex flex-col gap-4 p-5">
			<div class="party-divider"></div>
			{#if lan.theme}
				<div class="quest-tag">
					<i class="fa-solid fa-star"></i>
					<span>{lan.theme}</span>
				</div>
			{/if}
			{#if lan.description}
				<p class="text-[var(--text-muted)]">{lan.description}</p>
			{/if}
			<div class="flex flex-wrap gap-3">
				<a href="/players" class="button !bg-[var(--accent)] !text-white">
					<i class="fa-solid fa-user-plus mr-2"></i>{lan.status === 'expired'
						? 'View players'
						: 'Join party'}
				</a>
				<a href="/wheel" class="button">
					<i class="fa-solid fa-dice mr-2"></i>Open wheel
				</a>
			</div>
			<div class="grid gap-2 sm:grid-cols-2">
				<div class="command-card">
					<div class="section-kicker">
						<i class="fa-solid fa-users"></i>
						<span>Roster</span>
					</div>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each lan.attendeeNames as name (name)}
							<span class="stat-chip">{name}</span>
						{/each}
					</div>
				</div>
				<div class="command-card">
					<div class="section-kicker">
						<i class="fa-solid fa-gamepad"></i>
						<span>Game Queue</span>
					</div>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each lan.games as game (game)}
							<span class="stat-chip"><i class="fa-solid fa-gamepad"></i>{game}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section class="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
	<div class="game-panel p-5">
		<div class="relative z-10">
			<div class="arcade-section-title">
				<div>
					<div class="quest-tag mb-2">
						<i class="fa-solid fa-trophy"></i>
						<span>Tournament Board</span>
					</div>
					<h2>Game plan and results</h2>
				</div>
			</div>

			{#if lan.tournaments?.length}
				<ul class="grid gap-4">
					{#each lan.tournaments as tournament (tournament.id)}
						<li class="tournament-card">
							<div class="mb-3 flex flex-wrap items-center justify-between gap-3">
								<div>
									<div class="font-display text-sm">{tournament.name}</div>
									<div class="text-sm text-[var(--text-muted)]">{tournament.game}</div>
								</div>
								<div class="flex flex-wrap gap-2">
									{#if tournament.time}
										<span class="stat-chip"
											><i class="fa-regular fa-clock"></i>{tournament.time}</span
										>
									{/if}
									{#if tournament.winner}
										<span class="quest-tag"
											><i class="fa-solid fa-crown"></i>{tournament.winner}</span
										>
									{/if}
								</div>
							</div>

							{#if tournament.matches?.length}
								<ul class="grid gap-2">
									{#each tournament.matches as match (match.id)}
										<li class="match-row">
											<div class="text-sm">
												<span class="font-display text-[0.65rem] text-[var(--accent)]"
													>R{match.round}</span
												>
												<span>{match.playerA} vs {match.playerB}</span>
											</div>
											<div class="flex flex-wrap gap-2">
												{#if match.score}
													<span class="stat-chip">{match.score}</span>
												{/if}
												{#if match.winner}
													<span class="quest-tag">Winner: {match.winner}</span>
												{/if}
											</div>
										</li>
									{/each}
								</ul>
							{:else}
								<div class="text-[var(--text-muted)]">
									Time attack / free-for-all results will appear here.
								</div>
							{/if}
						</li>
					{/each}
				</ul>
			{:else}
				<div class="text-[var(--text-muted)]">No tournaments planned.</div>
			{/if}
		</div>
	</div>

	<div class="game-panel p-5">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-plug"></i>
				<span>Consoles and Gear</span>
			</div>
			{#if lan.consoles?.length}
				<ul class="grid gap-2">
					{#each lan.consoles as console (console.name)}
						<li class="gear-row">
							<div class="flex items-center gap-2">
								<i class="fa-solid fa-gamepad text-[var(--accent)]"></i>
								<span>{console.name}</span>
							</div>
							<span class="stat-chip">x{console.count}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="text-[var(--text-muted)]">No consoles listed.</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.tournament-card,
	.match-row,
	.gear-row {
		border: 2px solid var(--border);
		border-radius: 12px;
		background: var(--surface-sunken);
	}

	.tournament-card {
		padding: 1rem;
	}

	.match-row,
	.gear-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.75rem;
	}

	.match-row {
		flex-wrap: wrap;
		background: var(--surface);
	}
</style>
