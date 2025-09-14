<script lang="ts">
  import UserCard, { type Rarity } from "$lib/components/UserCard.svelte";
  import PaginationControls from '$lib/components/PaginationControls.svelte';
  import type { User } from '$lib/server/db/schema';

  type Player = User & {
    avatarUrl?: string;
    title?: string;
    rarity?: Rarity;
    attendanceCount?: number;
    winStreak?: number;
    consoleCount?: number;
  };

  // TODO: replace with real fetch from DB/API
  const allPlayers: Player[] = [
    { id: 'u1', username: 'FragMaster', age: 24, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=68', title: 'Tekken King', rarity: 'legendary', attendanceCount: 14, winStreak: 6, consoleCount: 3 },
    { id: 'u2', username: 'PixelQueen', age: 21, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=32', title: 'Smash Diva', rarity: 'epic', attendanceCount: 12, winStreak: 4, consoleCount: 2 },
    { id: 'u3', username: 'NoScope', age: 27, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=12', title: 'CS2 Ace', rarity: 'rare', attendanceCount: 9, winStreak: 3, consoleCount: 1 },
    { id: 'u4', username: 'LANLegend', age: 26, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=23', title: 'Valorant Shotcaller', rarity: 'epic', attendanceCount: 11, winStreak: 2, consoleCount: 2 },
    { id: 'u5', username: 'SnackBringer', age: 30, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=5', title: 'Logistics MVP', rarity: 'common', attendanceCount: 15, winStreak: 1, consoleCount: 5 },
    { id: 'u6', username: 'CableGuy', age: 22, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=7', title: 'Setup Wizard', rarity: 'rare', attendanceCount: 8, winStreak: 2, consoleCount: 1 },
    { id: 'u7', username: 'LagWizard', age: 28, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=14', title: 'Ping Whisperer', rarity: 'common', attendanceCount: 7, winStreak: 1, consoleCount: 2 },
    { id: 'u8', username: 'PatchNotes', age: 25, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=9', title: 'Meta Analyst', rarity: 'rare', attendanceCount: 10, winStreak: 3, consoleCount: 2 },
    { id: 'u9', username: 'TeaBag', age: 29, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=19', title: 'BM Enthusiast', rarity: 'epic', attendanceCount: 6, winStreak: 5, consoleCount: 1 },
    { id: 'u10', username: 'VSync', age: 20, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=44', title: 'Frame Lord', rarity: 'common', attendanceCount: 4, winStreak: 1, consoleCount: 1 },
    { id: 'u11', username: 'WarmupOnly', age: 23, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=16', title: 'Aim Lab Champ', rarity: 'rare', attendanceCount: 3, winStreak: 2, consoleCount: 1 },
    { id: 'u12', username: 'Smurfette', age: 31, passwordHash: '', avatarUrl: 'https://i.pravatar.cc/100?img=25', title: 'Bracket Breaker', rarity: 'epic', attendanceCount: 9, winStreak: 4, consoleCount: 2 }
  ];

  const ranked = [...allPlayers].sort((a, b) => ((b.attendanceCount ?? 0) + 2*(b.winStreak ?? 0)) - ((a.attendanceCount ?? 0) + 2*(a.winStreak ?? 0)));

  let page = 1;
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(ranked.length / pageSize));
  $effect(() => {
    if (page > pageCount) page = pageCount;
    if (page < 1) page = 1;
  });
  const pageItems = () => ranked.slice((page - 1) * pageSize, page * pageSize);

  const rankOf = (id: string) => ranked.findIndex(p => p.id === id) + 1;
</script>

<section class="mt-4">
  <h1 class="mb-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">Players</h1>

  {#if ranked.length > 0}
    <ul class="grid gap-3">
      {#each pageItems() as p (p.id)}
        <li>
          <UserCard
            id={p.id}
            username={p.username}
            avatarUrl={p.avatarUrl ?? 'https://i.pravatar.cc/100'}
            title={p.title ?? ''}
            rarity={p.rarity ?? 'common'}
            attendanceCount={p.attendanceCount ?? 0}
            winStreak={p.winStreak ?? 0}
            consoleCount={p.consoleCount ?? 0}
            rank={rankOf(p.id)}
          />
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
    <div class="rounded-xl border border-dashed p-6 text-slate-600">No players found.</div>
  {/if}
</section>