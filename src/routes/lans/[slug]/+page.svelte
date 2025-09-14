<script lang="ts">
  import type { PageProps } from './$types';
  import type { LanDetail } from './+page';

  let { data }: PageProps = $props();
  const lan: LanDetail = data.lan as LanDetail;

  const formatDate = (iso: string) => new Date(iso).toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });
</script>

<section class="relative mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow dark:bg-slate-800 dark:border-slate-700">
  {#if lan.coverImage}
    <div class="relative h-56 w-full sm:h-72 md:h-80">
      <img src={lan.coverImage} alt={lan.title} class="absolute inset-0 h-full w-full object-cover" />
    </div>
  {:else}
    <div class="flex h-40 items-center justify-center text-slate-500">No cover image</div>
  {/if}
</section>

<section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow dark:bg-slate-800 dark:border-slate-700">
  <h1 class="text-2xl font-extrabold sm:text-3xl">{lan.title}</h1>
  <div class="mt-1 flex flex-wrap items-center gap-3 text-slate-600">
    <div class="flex items-center gap-2">
      <i class="fa-regular fa-calendar"></i>
      <span>{formatDate(lan.date)}</span>
    </div>
    <div class="flex items-center gap-2">
      <i class="fa-solid fa-user-group text-slate-400"></i>
      <span>{lan.attendees} attending</span>
    </div>
    {#if lan.location}
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-location-dot text-rose-400"></i>
        <span>{lan.location}</span>
      </div>
    {/if}
  </div>
  {#if lan.description}
    <p class="mt-3 max-w-prose text-slate-700">{lan.description}</p>
  {/if}
</section>

<section class="mt-6 grid gap-6 md:grid-cols-3">
  <!-- Games -->
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow dark:bg-slate-800 dark:border-slate-700">
    <h2 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">Games</h2>
    {#if lan.games?.length}
      <ul class="list-inside list-disc text-slate-700">
        {#each lan.games as g (g)}
          <li>{g}</li>
        {/each}
      </ul>
    {:else}
      <div class="text-slate-500">No games listed yet.</div>
    {/if}
  </div>

  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow dark:bg-slate-800 dark:border-slate-700">
    <h2 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">Tournaments</h2>
    {#if lan.tournaments?.length}
      <ul class="grid gap-2">
        {#each lan.tournaments as t (t.name)}
          <li class="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <div class="flex min-w-0 flex-col">
              <span class="font-medium">{t.name}</span>
              <span class="text-xs text-slate-500">{t.game}</span>
            </div>
            {#if t.time}
              <div class="text-xs text-slate-600"><i class="fa-regular fa-clock mr-1"></i>{t.time}</div>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <div class="text-slate-500">No tournaments planned.</div>
    {/if}
  </div>

  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow dark:bg-slate-800 dark:border-slate-700">
    <h2 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">Consoles</h2>
    {#if lan.consoles?.length}
      <ul class="grid gap-2">
        {#each lan.consoles as c (c.name)}
          <li class="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-gamepad text-indigo-500"></i>
              <span>{c.name}</span>
            </div>
            <span class="tabular-nums text-slate-600">x{c.count}</span>
          </li>
        {/each}
      </ul>
    {:else}
      <div class="text-slate-500">No consoles listed.</div>
    {/if}
  </div>
</section>
