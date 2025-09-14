<script lang="ts">
  export let page: number;
  export let pageCount: number;
  export let onPrev: () => void;
  export let onNext: () => void;
</script>

<div class="mt-4 flex items-center justify-between">
  <button class="button border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200" on:click={onPrev} disabled={page === 1} aria-label="Previous page">
    Prev
  </button>
  <div class="text-sm text-slate-600 dark:text-slate-300">Page {page} of {pageCount}</div>
  <button class="button border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200" on:click={onNext} disabled={page === pageCount} aria-label="Next page">
    Next
  </button>
</div>
