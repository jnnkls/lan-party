<script lang="ts">
  import type { LanEvent } from '$lib/types';
  import HomeHero from '$lib/components/HomeHero.svelte';
  import LanCard from '$lib/components/LanCard.svelte';

  // TODO: Replace with real data from your DB/API
  const events: LanEvent[] = [
    {
      id: 'lan-005',
      title: 'Autumn FragFest',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      location: 'Community Hall',
      description: 'CS2, Valorant, Trackmania night. BYO rig and snacks.',
      coverImage: '/lan-cover-2.jpg'
    },
    {
      id: 'lan-004',
      title: 'Summer Night LAN',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      location: 'Garage HQ',
      description: 'Pizza, racing, and party games.',
      coverImage: '/lan-cover-2.jpg'
    },
    {
      id: 'lan-003',
      title: 'Spring Bootcamp',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      location: 'LAN Lounge',
      description: 'Practice bracket + casual matches.',
      coverImage: '/lan-cover-2.jpg'
    }
  ];

  const now = new Date();
  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const past = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
</script>

<HomeHero next={upcoming.length > 0 ? upcoming[0] : null} />

<section class="mt-8">
  <h3 class="mb-3 text-lg font-semibold text-slate-800 dark:text-slate-100">Recent events and happenings</h3>

  {#if past.length > 0}
    <ul class="grid gap-4">
      {#each past as e (e.id)}
        <LanCard lan={e} clickable={true} showStats={false} />
      {/each}
    </ul>
  {:else}
    <div class="rounded-xl border border-dashed p-6 text-slate-600">No past events yet. After your first LAN, highlights will appear here.</div>
  {/if}
</section>
