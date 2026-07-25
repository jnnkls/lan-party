<script lang="ts">
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import type { PageProps } from './$types';

	type Tab = 'overall' | 'tournament' | 'attendance';
	let activeTab = $state<Tab>('overall');

	let { data }: PageProps = $props();
	const allUsers = data.users;

	const sorted = [...allUsers].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
	const top3 = sorted.slice(0, 3);
	const others = sorted.slice(3);
	const maxScore = Math.max(1, sorted[0]?.score ?? 1);

	let page = $state(1);
	const pageSize = 10;
	const pageCount = Math.max(1, Math.ceil(others.length / pageSize));
	$effect(() => {
		if (page > pageCount) page = pageCount;
		if (page < 1) page = 1;
	});
	const paginated = () => others.slice((page - 1) * pageSize, page * pageSize);
</script>

<section class="mt-4">
	<div class="screen-header">
		<div class="flex flex-wrap items-center justify-between gap-4 pb-3">
			<div>
				<div class="quest-tag mb-3">
					<i class="fa-solid fa-ranking-star"></i>
					<span>High Score</span>
				</div>
				<h1>Leaderboard</h1>
			</div>
			<div class="flex flex-wrap gap-2">
				<span class="stat-chip"><i class="fa-solid fa-star"></i>{sorted[0]?.score ?? 0} top XP</span
				>
				<span class="stat-chip"><i class="fa-solid fa-medal"></i>{top3.length} podium</span>
			</div>
		</div>
		<div class="segmented-control" aria-label="Leaderboard sections">
			<button
				class:active={activeTab === 'overall'}
				aria-current={activeTab === 'overall' ? 'page' : undefined}
				onclick={() => (activeTab = 'overall')}
			>
				Overall
			</button>
			<button
				class:active={activeTab === 'tournament'}
				aria-current={activeTab === 'tournament' ? 'page' : undefined}
				onclick={() => (activeTab = 'tournament')}
			>
				Tournament
			</button>
			<button
				class:active={activeTab === 'attendance'}
				aria-current={activeTab === 'attendance' ? 'page' : undefined}
				onclick={() => (activeTab = 'attendance')}
			>
				Attendance
			</button>
		</div>
	</div>

	{#if top3.length > 0}
		<div class="game-panel podium-panel p-6">
			<div class="relative z-10 mb-5 flex flex-wrap items-center justify-between gap-3">
				<div class="section-kicker">
					<i class="fa-solid fa-crown"></i>
					<span>Arcade Podium</span>
				</div>
				<span class="stat-chip">Season XP ranking</span>
			</div>
			<div class="relative z-10 grid grid-cols-3 items-end gap-3 sm:gap-6">
				{#each [1, 0, 2] as idx (idx)}
					{#if top3[idx]}
						<div class={`podium-slot rank-${idx + 1}`}>
							<div class="mb-3 flex flex-col items-center text-center">
								<img
									src={top3[idx].avatarUrl ?? 'https://i.pravatar.cc/100'}
									alt={top3[idx].username}
									class="h-16 w-16 rounded-full border-2 border-[var(--border-strong)] shadow ring-2 ring-white sm:h-20 sm:w-20"
								/>
								<span class="font-display mt-2 text-[0.7rem]">{top3[idx].username}</span>
								<span class="text-xs text-[var(--text-muted)]">{top3[idx].score ?? 0} pts</span>
							</div>
							<div
								class={idx === 0
									? 'h-24 w-full rounded-xl bg-[var(--accent)] shadow-md sm:h-24'
									: idx === 1
										? 'h-12 w-full rounded-xl bg-[var(--party-blue)] shadow sm:h-12'
										: 'h-4 w-full rounded-xl bg-[var(--party-pink)] shadow sm:h-4'}
							>
								<span class="font-display text-white">#{idx + 1}</span>
							</div>
						</div>
					{/if}
				{/each}
			</div>
			<div
				class="relative z-10 mt-3 grid grid-cols-3 text-center text-xs tracking-wide text-[var(--text-muted)] uppercase"
			>
				<div>2nd</div>
				<div>1st</div>
				<div>3rd</div>
			</div>
		</div>
	{:else}
		<div class="game-panel p-6 text-[var(--text-muted)]">No users yet.</div>
	{/if}
</section>

<section class="mt-8">
	<div class="arcade-section-title">
		<div>
			<div class="quest-tag mb-2">
				<i class="fa-solid fa-list-ol"></i>
				<span>Score Table</span>
			</div>
			<h2>All players</h2>
		</div>
	</div>

	{#if others.length > 0}
		<ul class="grid gap-3">
			{#each paginated() as u (u.id)}
				<li class="quest-card leaderboard-row p-3">
					<div class="relative z-10 flex min-w-0 items-center gap-3">
						<img
							class="h-12 w-12 rounded-full border-2 border-[var(--border)]"
							alt={u.username}
							src={u.avatarUrl ?? 'https://i.pravatar.cc/100'}
						/>
						<div class="min-w-0 flex-1">
							<span class="font-display block truncate text-[0.72rem]">{u.username}</span>
							<span class="text-xs text-[var(--text-muted)]">{u.score ?? 0} pts</span>
							<div class="xp-track mt-2">
								<span
									class="xp-fill"
									style={`width: ${Math.max(6, Math.round(((u.score ?? 0) / maxScore) * 100))}%`}
								></span>
							</div>
						</div>
					</div>
					<div class="stat-chip relative z-10">
						#{3 + others.findIndex((x) => x.id === u.id) + 1}
					</div>
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
		<div class="game-panel p-6 text-[var(--text-muted)]">No other users.</div>
	{/if}
</section>

<style>
	.podium-panel :global(.rounded-xl) {
		display: flex;
		align-items: end;
		justify-content: center;
		border: 2px solid var(--border-strong);
		border-radius: 12px 12px 6px 6px;
	}

	.podium-slot {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: center;
	}

	.rank-1 {
		transform: translateY(-0.75rem);
	}

	.leaderboard-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 1rem;
	}

	@media (max-width: 640px) {
		.leaderboard-row {
			grid-template-columns: 1fr;
		}
	}
</style>
