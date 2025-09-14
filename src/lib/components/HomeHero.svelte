<script lang="ts">
  import ImageFill from './ImageFill.svelte';
  import type { LanEvent } from '$lib/types';

  export let next: LanEvent | null = null;
</script>

<section class="relative mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow dark:bg-slate-800 dark:border-slate-700">
  <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900"></div>

  {#if next}
    <div class="grid gap-6 sm:grid-cols-3 sm:min-h-56">
      <div class="sm:col-span-2 m-8 flex flex-col gap-3">
        <h1 class="text-3xl font-extrabold sm:text-4xl">LAN Party Hub</h1>
        <div class="flex items-baseline gap-2 text-slate-600">
          <span class="text-sm">Next up:</span>
          <span class="text-lg font-semibold text-slate-900">{next.title}</span>
          {#if next.location}
            <span class="text-xs text-slate-500">· {next.location}</span>
          {/if}
        </div>

        <div class="flex flex-wrap items-center gap-3 text-slate-700">
          <div class="flex items-center gap-2">
            <i class="fa-regular fa-calendar"></i>
            <span>{new Date(next.date).toLocaleString(undefined, { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div class="hidden sm:block h-4 w-px bg-slate-300/70"></div>
          <div class="text-xs text-slate-500">Plan, organize, and relive your LAN parties.</div>
        </div>

        {#if next.description}
          <p class="text-slate-700">{next.description}</p>
        {/if}

        <div class="mt-2 flex gap-3">
          <a href="/lans" class="button border-slate-300 hover:border-amber-400">View all LANs</a>
          <a href={`/lans/${next.id}`} class="button bg-amber-500 text-white hover:border-amber-600">Join / Details</a>
        </div>
      </div>

      <div class="relative overflow-hidden bg-slate-200 sm:self-stretch">
        <ImageFill src={next.coverImage} alt={next.title} />
      </div>
    </div>
  {:else}
    <div class="p-6 sm:p-10">
      <h1 class="text-2xl font-extrabold sm:text-4xl">LAN Party Hub</h1>
      <div class="mt-3 rounded-xl border border-dashed p-6 text-slate-600">No upcoming events yet. Create one on the LANs page.</div>
    </div>
  {/if}
</section>
