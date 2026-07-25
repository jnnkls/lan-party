<script lang="ts">
	import UserCard from '$lib/components/UserCard.svelte';
	import LanCard from '$lib/components/LanCard.svelte';
	import PaginationControls from '$lib/components/PaginationControls.svelte';
	import type { PageProps } from './$types';
	import type { PlayerDetail } from '$lib/types';

	let { data }: PageProps = $props();
	const player = data.player as PlayerDetail;

	let lanPage = $state(1);
	let tPage = $state(1);
	const pageSize = 6;
	const lanPageCount = Math.max(1, Math.ceil((player.attendedLANs?.length ?? 0) / pageSize));
	const tPageCount = Math.max(1, Math.ceil((player.tournaments?.length ?? 0) / pageSize));

	$effect(() => {
		if (lanPage > lanPageCount) lanPage = lanPageCount;
		if (lanPage < 1) lanPage = 1;
	});

	$effect(() => {
		if (tPage > tPageCount) tPage = tPageCount;
		if (tPage < 1) tPage = 1;
	});

	const lanItems = () =>
		(player.attendedLANs ?? []).slice((lanPage - 1) * pageSize, lanPage * pageSize);
	const tItems = () => (player.tournaments ?? []).slice((tPage - 1) * pageSize, tPage * pageSize);

	const placementClass = (n?: number) => {
		if (!n || n > 3) return 'placement-badge';
		if (n === 1) return 'placement-badge first';
		if (n === 2) return 'placement-badge second';
		return 'placement-badge third';
	};
</script>

<section class="mt-4">
	<UserCard
		id={player.id}
		username={player.username}
		avatarUrl={player.avatarUrl ?? 'https://i.pravatar.cc/100'}
		title={player.title ?? ''}
		rarity={player.rarity ?? 'common'}
		attendanceCount={player.attendanceCount ?? 0}
		winStreak={player.winStreak ?? 0}
		consoleCount={player.consoleCount ?? 0}
		xp={player.xp ?? 0}
		rank={player.rank ?? 0}
	/>
</section>

<section class="mt-6 grid gap-6 lg:grid-cols-3">
	<div class="game-panel p-4 lg:col-span-1">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-gamepad"></i>
				<span>Gear Rack</span>
			</div>
			<h2 class="mb-3">Consoles owned</h2>

			{#if player.consoles?.length}
				<ul class="grid gap-2">
					{#each player.consoles as c (c.name)}
						<li class="loadout-row">
							<div class="flex items-center gap-2">
								<i class="fa-solid fa-gamepad text-[var(--accent)]"></i>
								<span>{c.name}</span>
							</div>
							<span class="stat-chip tabular-nums">x{c.count}</span>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="text-[var(--text-muted)]">No consoles listed.</div>
			{/if}
		</div>
	</div>

	<div class="game-panel p-4 lg:col-span-2">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-ethernet"></i>
				<span>Party History</span>
			</div>
			<h2 class="mb-3">Attended LAN Parties</h2>

			{#if player.attendedLANs?.length}
				<ul class="grid gap-3">
					{#each lanItems() as e (e.id)}
						<LanCard
							lan={{
								id: e.id,
								title: e.title,
								date: e.date,
								coverImage: e.coverImage,
								description: '',
								location: '',
								attendees: e.attendees
							}}
							clickable={true}
							showStats={true}
						/>
					{/each}
				</ul>
				{#if lanPageCount > 1}
					<PaginationControls
						page={lanPage}
						pageCount={lanPageCount}
						onPrev={() => (lanPage = Math.max(1, lanPage - 1))}
						onNext={() => (lanPage = Math.min(lanPageCount, lanPage + 1))}
					/>
				{/if}
			{:else}
				<div class="text-[var(--text-muted)]">No LANs attended yet.</div>
			{/if}
		</div>
	</div>
</section>

<section class="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
	<div class="game-panel p-4">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-id-badge"></i>
				<span>Title Loadout</span>
			</div>
			<h2 class="mb-3">Unlocked titles</h2>
			{#if player.titles?.length}
				<div class="flex flex-wrap gap-2">
					{#each player.titles as title (title)}
						<span class="stat-chip"><i class="fa-solid fa-ribbon"></i>{title}</span>
					{/each}
				</div>
			{:else}
				<div class="text-[var(--text-muted)]">No titles unlocked yet.</div>
			{/if}
		</div>
	</div>

	<div class="game-panel p-4">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-shield-heart"></i>
				<span>Achievements</span>
			</div>
			<h2 class="mb-3">Badge collection</h2>
			{#if player.achievements?.length}
				<ul class="grid gap-2">
					{#each player.achievements as achievement (achievement.id)}
						<li class="achievement-row">
							<div>
								<div class="font-display text-[0.7rem]">{achievement.name}</div>
								<div class="text-sm text-[var(--text-muted)]">{achievement.description}</div>
							</div>
							<span class="stat-chip">+{achievement.xp} XP</span>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="text-[var(--text-muted)]">No achievements unlocked yet.</div>
			{/if}
		</div>
	</div>
</section>

<section class="mt-6">
	<div class="game-panel p-4">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-trophy"></i>
				<span>Trophy Case</span>
			</div>
			<h2 class="mb-3">Tournaments and outcomes</h2>

			{#if player.tournaments?.length}
				<ul class="grid gap-2">
					{#each tItems() as t (t.id)}
						<li class="loadout-row">
							<div class="flex min-w-0 items-center gap-3">
								<div class="trophy-token">
									<i class="fa-solid fa-trophy"></i>
								</div>
								<div class="min-w-0">
									<div class="truncate font-medium">{t.name}</div>
									<div class="truncate text-xs text-[var(--text-muted)]">
										{t.game}{t.lanId ? ` at LAN ${t.lanId}` : ''}
									</div>
								</div>
							</div>
							<div class="ml-3 flex items-center gap-2">
								{#if t.placement}
									<span class={placementClass(t.placement)}
										>{t.placement}{t.placement === 1
											? 'st'
											: t.placement === 2
												? 'nd'
												: t.placement === 3
													? 'rd'
													: 'th'}</span
									>
								{:else if t.result}
									<span class="placement-badge">{t.result}</span>
								{:else}
									<span class="placement-badge">Pending</span>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
				{#if tPageCount > 1}
					<PaginationControls
						page={tPage}
						pageCount={tPageCount}
						onPrev={() => (tPage = Math.max(1, tPage - 1))}
						onNext={() => (tPage = Math.min(tPageCount, tPage + 1))}
					/>
				{/if}
			{:else}
				<div class="text-[var(--text-muted)]">No tournaments attended yet.</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.loadout-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-sunken);
		padding: 0.75rem;
	}

	.achievement-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-sunken);
		padding: 0.8rem;
	}

	.trophy-token {
		display: flex;
		height: 2.2rem;
		width: 2.2rem;
		flex-shrink: 0;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface);
		color: var(--accent);
	}

	.placement-badge {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--border);
		border-radius: 2px;
		background: var(--surface);
		color: var(--text-muted);
		padding: 0.35rem 0.55rem;
		font-family: 'Press Start 2P', 'Open Sans', system-ui, sans-serif;
		font-size: 0.6rem;
		font-weight: 400;
		line-height: 1.6;
		text-transform: uppercase;
	}

	.placement-badge.first {
		background: var(--accent);
		color: var(--on-accent);
	}

	.placement-badge.second {
		background: var(--surface-raised);
		color: var(--text);
	}

	.placement-badge.third {
		background: var(--surface-raised);
		color: white;
	}
</style>
