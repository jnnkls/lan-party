<script lang="ts">
  import type { LanEvent } from '$lib/types';
  import LanCard from '$lib/components/LanCard.svelte';
  import PaginationControls from '$lib/components/PaginationControls.svelte';

  type LanOverview = LanEvent & {
    attendees?: number;
  };

  // TODO: Replace with real data from DB/API
  const lans: LanOverview[] = [
    {
      id: 'lan-006',
      title: 'Winter LAN Bash',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      location: 'Makerspace',
      description: 'A cozy winter get-together with CS2, Valorant and Jackbox in the late hours.',
      coverImage: '/lan-cover-2.jpg',
      attendees: 18
    },
    {
      id: 'lan-005',
      title: 'Autumn FragFest',
      date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
      location: 'Community Hall',
      description: 'CS2, Valorant, Trackmania night. BYO rig and snacks.',
      coverImage: '/lan-cover-2.jpg',
      attendees: 24
    },
    {
      id: 'lan-004',
      title: 'Summer Night LAN',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
      location: 'Garage HQ',
      description: 'Pizza, racing, and party games.',
      coverImage: '/lan-cover-2.jpg',
      attendees: 21
    },
    {
      id: 'lan-003',
      title: 'Spring Bootcamp',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
      location: 'LAN Lounge',
      description: 'Practice bracket + casual matches.',
      coverImage: '/lan-cover-2.jpg',
      attendees: 17
    }
  ];

  const sorted = [...lans].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  let page = 1;
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  $effect(() => {
    if (page > pageCount) page = pageCount;
    if (page < 1) page = 1;
  });
  const pageItems = () => sorted.slice((page - 1) * pageSize, page * pageSize);
</script>

<section class="mt-4">
  <h1 class="mb-4 text-3xl font-extrabold text-slate-800 dark:text-slate-100">LANs</h1>

  {#if sorted.length > 0}
    <ul class="grid gap-4">
      {#each pageItems() as lan (lan.id)}
        <LanCard {lan} />
      {/each}
    </ul>

    <PaginationControls
      {page}
      {pageCount}
      onPrev={() => (page = Math.max(1, page - 1))}
      onNext={() => (page = Math.min(pageCount, page + 1))}
    />
  {:else}
    <div class="rounded-xl border border-dashed p-6 text-slate-600">No LANs found.</div>
  {/if}
</section>
