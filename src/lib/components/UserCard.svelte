<script lang="ts">
	import type { Rarity } from '$lib/types';

	export let id: string;
	export let username: string;
	export let avatarUrl: string = 'https://i.pravatar.cc/100';
	export let title: string = '';
	export let rarity: Rarity = 'common';
	export let attendanceCount: number = 0;
	export let winStreak: number = 0;
	export let consoleCount: number = 0;
	export let xp: number = 0;
	export let rank: number;

	const level = () => Math.max(1, Math.floor(xp / 250) + 1);
	const progress = () => Math.min(100, Math.round(((xp % 250) / 250) * 100));

	const rarityColor = (r: Rarity) => {
		switch (r) {
			case 'legendary':
				return 'background: linear-gradient(135deg, var(--accent), var(--party-yellow));';
			case 'epic':
				return 'background: linear-gradient(135deg, var(--party-pink), #d16bff);';
			case 'rare':
				return 'background: linear-gradient(135deg, var(--party-blue), var(--party-green));';
			default:
				return 'background: var(--text-muted);';
		}
	};
</script>

<div class="quest-card user-card">
	<a
		href={`/players/${id}`}
		aria-label={`Open ${username}`}
		class="absolute inset-0 z-10 block focus:outline focus:outline-2 focus:outline-[var(--accent)]"
		style="outline-offset: -4px;"
	></a>

	<div class="relative z-0 flex w-full flex-col sm:flex-row">
		<div
			class="avatar-frame relative h-40 shrink-0 overflow-hidden bg-[var(--surface-muted)] sm:h-auto sm:w-40"
		>
			<img
				src={avatarUrl}
				alt={username + ' avatar'}
				class="absolute inset-0 h-full w-full object-cover"
			/>
			<div
				class="font-display absolute top-3 left-3 rounded-[3px] bg-[var(--accent)] px-2 py-1 text-[0.75rem] text-white"
			>
				#{rank}
			</div>
		</div>

		<div class="flex min-w-0 flex-1 flex-col gap-3 p-5 text-[var(--text)]">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<span class="font-display truncate text-sm">{username}</span>
						<span class="h-3 w-3 rounded-full shadow" style={rarityColor(rarity)} aria-hidden="true"
						></span>
					</div>
					<div class="mt-2 flex flex-wrap gap-2">
						<div class="quest-tag">
							<i class="fa-solid fa-medal"></i>
							<span>{title || 'LAN Rookie'}</span>
						</div>
					</div>
				</div>
				<div class="level-badge">
					<span>LVL</span>
					<strong>{level()}</strong>
				</div>
			</div>

			<div class="xp-block">
				<div class="flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
					<span class="font-display text-[0.58rem]">XP {xp}</span>
					<span class="font-display text-[0.58rem]">{progress()}%</span>
				</div>
				<div class="xp-track">
					<span class="xp-fill" style={`width: ${progress()}%`}></span>
				</div>
			</div>

			<div class="grid grid-cols-3 gap-2 text-[var(--text-muted)]">
				<div class="stat-box">
					<i class="fa-solid fa-user-group"></i>
					<span class="tabular-nums">{attendanceCount}</span>
					<small>LANs</small>
				</div>
				<div class="stat-box">
					<i class="fa-solid fa-fire"></i>
					<span class="tabular-nums">{winStreak}</span>
					<small>Streak</small>
				</div>
				<div class="stat-box">
					<i class="fa-solid fa-gamepad"></i>
					<span class="tabular-nums">{consoleCount}</span>
					<small>Gear</small>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.stat-box {
		display: grid;
		gap: 0.2rem;
		justify-items: center;
		border: 1px solid var(--border);
		border-radius: 4px;
		background: var(--surface-sunken);
		padding: 0.65rem 0.35rem;
		text-align: center;
	}

	.avatar-frame::after {
		content: '';
		position: absolute;
		inset: 0;
		border-right: 1px solid var(--border-strong);
		background: linear-gradient(180deg, transparent 58%, rgba(0, 0, 0, 0.38));
		pointer-events: none;
	}

	.level-badge {
		display: grid;
		justify-items: center;
		min-width: 3.8rem;
		border: 1px solid var(--accent);
		border-radius: 4px;
		background: var(--accent);
		color: white;
		padding: 0.45rem;
		box-shadow: none;
	}

	.level-badge span {
		font-family: 'Open Sans', system-ui, sans-serif;
		font-size: 0.58rem;
		font-weight: 800;
	}

	.level-badge strong {
		font-family: 'Open Sans', system-ui, sans-serif;
		font-size: 1.25rem;
		line-height: 1;
	}

	.xp-block {
		display: grid;
		gap: 0.45rem;
	}

	.stat-box i {
		color: var(--accent);
	}

	.stat-box span {
		color: var(--text);
		font-weight: 800;
	}

	.stat-box small {
		font-size: 0.68rem;
	}
</style>
