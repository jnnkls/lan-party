<script lang="ts">
	export let page: number;
	export let pageCount: number;
	export let onPrev: () => void;
	export let onNext: () => void;
</script>

<div class="game-panel mt-5 flex items-center justify-between gap-3 p-3">
	<button
		class="button relative z-10"
		onclick={onPrev}
		disabled={page === 1}
		aria-label="Previous page"
	>
		<i class="fa-solid fa-caret-left mr-2"></i>Prev
	</button>
	<div class="stat-chip relative z-10">Page {page} / {pageCount}</div>
	<button
		class="button relative z-10"
		onclick={onNext}
		disabled={page === pageCount}
		aria-label="Next page"
	>
		Next<i class="fa-solid fa-caret-right ml-2"></i>
	</button>
</div>
