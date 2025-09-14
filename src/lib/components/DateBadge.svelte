<script lang="ts">
  export let dateIso: string;
  export let endedLabel: string = 'Ended';
  const now = new Date();
  const isEnded = (iso: string) => new Date(iso) < now;
  const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
</script>

<span class={isEnded(dateIso) ? 'rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow' : 'rounded-full bg-amber-500/90 px-3 py-1 text-xs font-semibold text-white shadow'}>
  {#if isEnded(dateIso)}
    {endedLabel}
  {:else}
    {formatDate(dateIso)}
  {/if}
</span>
