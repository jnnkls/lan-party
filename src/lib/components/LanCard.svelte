<script lang="ts">
  import DateBadge from './DateBadge.svelte';
  import ImageFill from './ImageFill.svelte';
  import type { LanEvent } from '$lib/types';

  export type LanOverview = LanEvent & { attendees?: number };

  export let lan: LanOverview;
  export let clickable: boolean = true;
  export let showStats: boolean = true;
</script>

<li class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow dark:bg-slate-800 dark:border-slate-700">
  {#if clickable}
    <a href={`/lans/${lan.id}`} aria-label={`Open ${lan.title}`} class="absolute inset-0 z-10 block focus:outline focus:outline-2 focus:outline-amber-500" style="outline-offset: -4px;"></a>
  {/if}

  <!-- Badge -->
  <div class="pointer-events-none absolute right-3 top-3">
    <DateBadge dateIso={lan.date} />
  </div>

  <div class="flex flex-col sm:grid sm:grid-cols-3">
    <!-- Left: Image (1/3) -->
    <div class="sm:col-span-1 h-40 sm:h-40">
      <ImageFill src={lan.coverImage} alt={lan.title} />
    </div>

    <!-- Right: Content (2/3) -->
    <div class="sm:col-span-2 flex flex-col gap-2 p-4 text-slate-700 dark:text-slate-200">
      <div class="flex flex-wrap items-baseline gap-2">
        <span class="text-lg font-semibold">{lan.title}</span>
        {#if lan.location}
          <span class="text-xs text-slate-500">· {lan.location}</span>
        {/if}
      </div>

      {#if lan.description}
        <p class="text-slate-600 line-clamp-2">{lan.description}</p>
      {/if}

      <!-- Stats -->
      {#if showStats}
      <div class="mt-auto flex items-center gap-4 text-xs text-slate-600">
        <div class="flex items-center gap-1">
          <i class="fa-solid fa-user-group text-slate-400"></i>
          <span>{lan.attendees ?? 0} attending</span>
        </div>
      </div>
      {/if}
    </div>
  </div>
</li>
