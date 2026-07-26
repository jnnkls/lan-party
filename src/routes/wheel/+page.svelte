<script lang="ts">
	let newEntry = $state('');
	let entries = $state<string[]>([]);
	let selected = $state('');
	let spinning = $state(false);

	function addEntry() {
		const trimmed = newEntry.trim();
		if (trimmed && !entries.includes(trimmed)) {
			entries = [...entries, trimmed];
			newEntry = '';
		}
	}

	function removeEntry(entry: string) {
		entries = entries.filter((e) => e !== entry);
	}

	function spinWheel() {
		if (entries.length === 0 || spinning) return;

		spinning = true;
		selected = '';

		const duration = 2000;
		const targetIndex = Math.floor(Math.random() * entries.length);
		const result = entries[targetIndex];

		setTimeout(() => {
			selected = result;
			removeEntry(result);
			spinning = false;
		}, duration);
	}
</script>

<section class="mt-4">
	<div class="screen-header">
		<div class="flex flex-wrap items-center justify-between gap-4 pb-3">
			<div>
				<div class="quest-tag mb-3">
					<i class="fa-solid fa-dice"></i>
					<span>Bonus Round</span>
				</div>
				<h1>Random Wheel</h1>
			</div>
			<div class="stat-chip">
				<i class="fa-solid fa-wand-magic-sparkles"></i>
				<span>Pick the next quest</span>
			</div>
		</div>
	</div>

	<div class="game-panel p-6">
		<div class="relative z-10 flex flex-wrap gap-2">
			<input
				bind:value={newEntry}
				onkeydown={(e) => e.key === 'Enter' && addEntry()}
				placeholder="Add player, game, character..."
				class="min-w-0 flex-1"
			/>
			<button
				onclick={addEntry}
				class="!bg-[var(--accent)] !text-white hover:!bg-[var(--accent-strong)]"
			>
				<i class="fa-solid fa-plus mr-1"></i>Add
			</button>
		</div>

		<div class="relative z-10 mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
			<div>
				{#if entries.length > 0}
					<ul class="entry-list">
						{#each entries as entry (entry)}
							<li>
								<span class="truncate">{entry}</span>
								<button
									onclick={() => removeEntry(entry)}
									class="!border-red-300 !bg-red-50 !text-red-700 hover:!bg-red-100 dark:!border-red-800 dark:!bg-red-950/40 dark:!text-red-200"
									aria-label={`Remove ${entry}`}
								>
									<i class="fa-solid fa-xmark"></i>
								</button>
							</li>
						{/each}
					</ul>
				{:else}
					<div
						class="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-sunken)] p-5 text-[var(--text-muted)]"
					>
						Add entries to use the wheel.
					</div>
				{/if}
			</div>

			<div class="flex flex-col items-center justify-center gap-4">
				<button
					class={`wheel ${spinning ? 'spinning' : ''}`}
					onclick={spinWheel}
					disabled={entries.length === 0 || spinning}
					aria-label="Spin"
				>
					{#if spinning}
						<i class="fa-solid fa-dice"></i>
					{:else}
						Spin!
					{/if}
				</button>

				{#if selected}
					<div class="result">
						<span>Selected</span>
						<strong>{selected}</strong>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.entry-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.entry-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 0.9rem;
		background-color: var(--surface-sunken);
		border: 1px solid var(--border);
		border-radius: 4px;
		transition:
			background-color 0.2s,
			transform 0.15s;
	}

	.entry-list li:hover {
		transform: translateX(3px);
	}

	.wheel {
		position: relative;
		width: 220px;
		height: 220px;
		border: 10px solid var(--accent);
		border-radius: 50%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		background: conic-gradient(
			from 0deg,
			var(--accent),
			#2a2a2a,
			var(--accent-strong),
			#f7f7f2,
			#151515,
			var(--accent)
		);
		transition:
			transform 2s ease-in-out,
			border-color 0.2s,
			background 0.2s;
		font-weight: 400;
		font-size: 0.85rem;
		color: white;
		padding: 0;
		text-shadow: 0 2px 0 rgba(0, 0, 0, 0.35);
		box-shadow:
			inset 0 0 0 18px rgba(0, 0, 0, 0.32),
			0 20px 60px rgba(0, 0, 0, 0.42);
	}

	.wheel::after {
		content: '';
		position: absolute;
		width: 1rem;
		height: 1rem;
		border-radius: 999px;
		background: white;
		border: 4px solid var(--dark);
	}

	.spinning {
		transform: rotate(1440deg);
	}

	.result {
		display: grid;
		gap: 0.35rem;
		width: 100%;
		border: 1px solid var(--border-strong);
		border-radius: 4px;
		background: var(--surface-sunken);
		padding: 1rem;
		text-align: center;
	}

	.result span {
		font-family: 'Press Start 2P', 'Open Sans', system-ui, sans-serif;
		font-size: 0.62rem;
		font-weight: 400;
		color: var(--accent-strong);
		text-transform: uppercase;
	}

	.result strong {
		font-size: 1.25rem;
	}
</style>
