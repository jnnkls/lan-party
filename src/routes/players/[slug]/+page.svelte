<script lang="ts">
  import type { PageProps } from './$types';
  import UserCard from '$lib/components/UserCard.svelte';
  import LanCard from '$lib/components/LanCard.svelte';
  import PaginationControls from '$lib/components/PaginationControls.svelte';
  import type { PlayerDetail } from './+page';

  let { data }: PageProps = $props();
  const player = data.player as PlayerDetail;


  let lanPage = 1;
  let tPage = 1;
  const pageSize = 6;
  const lanPageCount = Math.max(1, Math.ceil((player.attendedLANs?.length ?? 0) / pageSize));
  const tPageCount = Math.max(1, Math.ceil((player.tournaments?.length ?? 0) / pageSize));
  $effect(() => { if (lanPage > lanPageCount) lanPage = lanPageCount; if (lanPage < 1) lanPage = 1; });
  $effect(() => { if (tPage > tPageCount) tPage = tPageCount; if (tPage < 1) tPage = 1; });
  const lanItems = () => (player.attendedLANs ?? []).slice((lanPage-1)*pageSize, lanPage*pageSize);
  const tItems = () => (player.tournaments ?? []).slice((tPage-1)*pageSize, tPage*pageSize);

  const placementBadge = (n?: number) => {
    if (!n || n > 3) return 'bg-slate-200 text-slate-700';
    if (n === 1) return 'bg-amber-400 text-white';
    if (n === 2) return 'bg-slate-300 text-slate-900';
    return 'bg-yellow-700 text-white';
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
    rank={player.rank ?? 0}
  />
</section>

<section class="mt-6 grid gap-6 lg:grid-cols-3">
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow lg:col-span-1 dark:bg-slate-800 dark:border-slate-700">
    <h2 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">Consoles owned</h2>
    {#if player.consoles?.length}
      <ul class="grid gap-2">
        {#each player.consoles as c (c.name)}
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

  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow lg:col-span-2 dark:bg-slate-800 dark:border-slate-700">
    <h2 class="mb-2 text-lg font-semibold">Attended LAN Parties</h2>
    {#if player.attendedLANs?.length}
      <ul class="grid gap-3">
        {#each lanItems() as e (e.id)}
          <LanCard lan={{ id: e.id, title: e.title, date: e.date, coverImage: e.coverImage, description: '', location: '', attendees: e.attendees }} clickable={true} showStats={true} />
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
      <div class="text-slate-500">No LANs attended yet.</div>
    {/if}
  </div>
</section>

<section class="mt-6">
  <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow dark:bg-slate-800 dark:border-slate-700">
    <h2 class="mb-2 text-lg font-semibold text-slate-800 dark:text-slate-100">Tournaments & outcomes</h2>
    {#if player.tournaments?.length}
      <ul class="grid gap-2">
        {#each tItems() as t (t.id)}
          <li class="flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <div class="flex min-w-0 items-center gap-3">
              <div class="h-8 w-8 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                <i class="fa-solid fa-trophy text-amber-500"></i>
              </div>
              <div class="min-w-0">
                <div class="truncate font-medium">{t.name}</div>
                <div class="truncate text-xs text-slate-500">{t.game}{t.lanId ? ` · LAN: ${t.lanId}` : ''}</div>
              </div>
            </div>
            <div class="ml-3 flex items-center gap-2">
              {#if t.placement}
                <span class={`rounded-full px-2 py-1 text-xs font-semibold ${placementBadge(t.placement)}`}>{t.placement}{t.placement === 1 ? 'st' : t.placement === 2 ? 'nd' : t.placement === 3 ? 'rd' : 'th'}</span>
              {:else if t.result}
                <span class="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">{t.result}</span>
              {:else}
                <span class="rounded-full bg-slate-200 px-2 py-1 text-xs text-slate-700">—</span>
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
      <div class="text-slate-500">No tournaments attended yet.</div>
    {/if}
  </div>
</section>
