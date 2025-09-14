<script lang="ts">
  import type { User } from '$lib/server/db/schema';
  import PaginationControls from '$lib/components/PaginationControls.svelte';

  // TODO: Replace mock with real data from DB/API
  type LeaderUser = User & { avatarUrl?: string; score?: number };

  type Tab = 'overall' | 'tournament' | 'attendance';
  let activeTab: Tab = 'overall';

  const allUsers: LeaderUser[] = [
    { id: 'u1', username: 'FragMaster', age: 24, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=68', score: 987 },
    { id: 'u2', username: 'PixelQueen', age: 21, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=32', score: 942 },
    { id: 'u3', username: 'NoScope', age: 27, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=12', score: 910 },
    { id: 'u4', username: 'LANLegend', age: 26, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=23', score: 880 },
    { id: 'u5', username: 'SnackBringer', age: 30, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=5', score: 850 },
    { id: 'u6', username: 'CableGuy', age: 22, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=7', score: 830 },
    { id: 'u7', username: 'LagWizard', age: 28, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=14', score: 820 },
    { id: 'u8', username: 'PatchNotes', age: 25, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=9', score: 800 },
    { id: 'u9', username: 'TeaBag', age: 29, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=19', score: 795 },
    { id: 'u10', username: 'VSync', age: 20, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=44', score: 780 },
    { id: 'u11', username: 'WarmupOnly', age: 23, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=16', score: 770 },
    { id: 'u12', username: 'Smurfette', age: 31, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=25', score: 760 }
  ];

  const sorted = [...allUsers].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const top3 = sorted.slice(0, 3);
  const others = sorted.slice(3);

  let page = 1;
  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(others.length / pageSize));
  $effect(() => {
    if (page > pageCount) page = pageCount;
    if (page < 1) page = 1;
  });
  const paginated = () => others.slice((page - 1) * pageSize, page * pageSize);
</script>

<nav class="fixed left-0 top-1/2 -translate-y-1/2 z-20 hidden md:flex w-40 flex-col items-center gap-2 p-3"
     aria-label="Leaderboard sections">
  <button class="button border-slate-300 text-center w-full"
          class:!bg-amber-500={activeTab==='overall'}
          class:!text-white={activeTab==='overall'}
          aria-current={activeTab==='overall' ? 'page' : undefined}
          on:click={() => activeTab='overall'}>
    Overall
  </button>
  <button class="button border-slate-300 text-center w-full"
          class:!bg-amber-500={activeTab==='tournament'}
          class:!text-white={activeTab==='tournament'}
          aria-current={activeTab==='tournament' ? 'page' : undefined}
          on:click={() => activeTab='tournament'}>
    Tournament
  </button>
  <button class="button border-slate-300 text-center w-full"
          class:!bg-amber-500={activeTab==='attendance'}
          class:!text-white={activeTab==='attendance'}
          aria-current={activeTab==='attendance' ? 'page' : undefined}
          on:click={() => activeTab='attendance'}>
    Attendance
  </button>
</nav>

<div class="mt-2 flex gap-2 md:hidden">
  <button class="button border-slate-300" class:!bg-amber-500={activeTab==='overall'} class:!text-white={activeTab==='overall'} on:click={() => activeTab='overall'}>Overall</button>
  <button class="button border-slate-300" class:!bg-amber-500={activeTab==='tournament'} class:!text-white={activeTab==='tournament'} on:click={() => activeTab='tournament'}>Tournament</button>
  <button class="button border-slate-300" class:!bg-amber-500={activeTab==='attendance'} class:!text-white={activeTab==='attendance'} on:click={() => activeTab='attendance'}>Attendance</button>
</div>

<section class="mt-4">
  <h1 class="mb-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">Leaderboard</h1>

  {#if top3.length > 0}
    <div class="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow dark:bg-slate-800 dark:border-slate-700">
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900"></div>
      <div class="grid grid-cols-3 items-end gap-4 sm:gap-6">
        {#each [1,0,2] as idx (idx)}
          {#if top3[idx]}
            <div class="flex flex-col items-center">
              <div class="mb-3 flex flex-col items-center">
                <img src={top3[idx].avatarUrl ?? 'https://i.pravatar.cc/100'} alt={top3[idx].username} class="h-16 w-16 rounded-full ring-2 ring-white shadow sm:h-20 sm:w-20" />
                <span class="mt-2 text-sm font-semibold">{top3[idx].username}</span>
                <span class="text-xs text-slate-500">{top3[idx].score ?? 0} pts</span>
              </div>
              <div class={
                idx === 0
                  ? 'h-24 w-full rounded-xl bg-amber-400/90 shadow-md sm:h-24'
                  : idx === 1
                  ? 'h-12 w-full rounded-xl bg-slate-300/90 shadow sm:h-12'
                  : 'h-4 w-full rounded-xl bg-yellow-700/70 shadow sm:h-4'
              }></div>
            </div>
          {/if}
        {/each}
      </div>
      <div class="mt-3 grid grid-cols-3 text-center text-xs uppercase tracking-wide text-slate-600">
        <div>2nd</div>
        <div>1st</div>
        <div>3rd</div>
      </div>
    </div>
  {:else}
    <div class="rounded-xl border border-dashed p-6 text-slate-600">No users yet.</div>
  {/if}
</section>

<section class="mt-8">
  <h2 class="mb-3 text-lg font-semibold">All players</h2>

  {#if others.length > 0}
    <ul class="grid gap-3">
      {#each paginated() as u (u.id)}
        <li class="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:bg-slate-800 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <img class="h-10 w-10 rounded-full" alt={u.username} src={u.avatarUrl ?? 'https://i.pravatar.cc/100'} />
            <div class="flex flex-col">
              <span class="font-medium">{u.username}</span>
              <span class="text-xs text-slate-500">{u.score ?? 0} pts</span>
            </div>
          </div>
          <div class="text-xs text-slate-500">#{3 + others.findIndex((x) => x.id === u.id) + 1}</div>
        </li>
      {/each}
    </ul>

    <PaginationControls
      {page}
      {pageCount}
      onPrev={() => (page = Math.max(1, page - 1))}
      onNext={() => (page = Math.min(pageCount, page + 1))}
    />
  {:else}
    <div class="rounded-xl border border-dashed p-6 text-slate-600">No other users.</div>
  {/if}
</section>
