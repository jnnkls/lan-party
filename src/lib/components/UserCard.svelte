
<script lang="ts">
  export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
  export let id: string;
  export let username: string;
  export let avatarUrl: string = 'https://i.pravatar.cc/100';
  export let title: string = '';
  export let rarity: Rarity = 'common';
  export let attendanceCount: number = 0;
  export let winStreak: number = 0;
  export let consoleCount: number = 0;
  export let rank: number;

  const rarityColor = (r: Rarity) => {
    switch (r) {
      case 'legendary':
        return 'bg-amber-400';
      case 'epic':
        return 'bg-purple-500';
      case 'rare':
        return 'bg-sky-500';
      default:
        return 'bg-slate-400';
    }
  };
</script>

<div class="user-card relative flex w-full items-stretch overflow-hidden rounded-2xl border border-slate-200 bg-white shadow dark:bg-slate-800 dark:border-slate-700">
  <a href={`/players/${id}`} aria-label={`Open ${username}`} class="absolute inset-0 z-10 block focus:outline focus:outline-2 focus:outline-amber-500" style="outline-offset: -4px;"></a>
  <div class="relative basis-1/6 shrink-0 overflow-hidden bg-slate-50 h-32 sm:h-auto">
    <img src={avatarUrl} alt={username + ' avatar'} class="absolute inset-0 h-full w-full object-cover" />
  </div>

  <div class="flex min-w-0 flex-1 basis-1/2 flex-col gap-1 p-4 text-slate-700 dark:text-slate-200">
    <div class="flex items-baseline gap-2">
      <span class="truncate text-lg font-semibold">{username}</span>
    </div>
    <div class="flex items-center gap-2 text-sm text-slate-600">
      <span class={`h-2.5 w-2.5 rounded-full ${rarityColor(rarity)}`} aria-hidden="true"></span>
      {#if title}
        <span class="truncate">{title}</span>
      {:else}
        <span class="truncate text-slate-500">No title</span>
      {/if}
    </div>
  </div>

  <div class="flex basis-1/6 shrink-0 flex-col justify-center gap-2 p-4 text-slate-600">
    <div class="flex items-center gap-2" title="LANs attended">
      <i class="fa-solid fa-user-group text-slate-400"></i>
      <span class="tabular-nums">{attendanceCount}</span>
    </div>
    <div class="flex items-center gap-2" title="Win streak">
      <i class="fa-solid fa-fire text-amber-500"></i>
      <span class="tabular-nums">{winStreak}</span>
    </div>
    <div class="flex items-center gap-2" title="Consoles owned">
      <i class="fa-solid fa-gamepad text-indigo-500"></i>
      <span class="tabular-nums">{consoleCount}</span>
    </div>
  </div>

  <div class="flex basis-1/6 shrink-0 items-center justify-center bg-slate-50 p-4">
    <div class="select-none text-2xl font-extrabold text-slate-700">#{rank}</div>
  </div>
</div>

<style>
  @media (max-width: 640px) {
    :global(.user-card) { display: flex; flex-direction: column; }
  }
</style>