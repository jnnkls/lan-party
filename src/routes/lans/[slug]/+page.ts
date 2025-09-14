import type { PageLoad } from './$types';
import type { LanEvent } from '$lib/types';
import { error } from '@sveltejs/kit';

export type LanDetail = LanEvent & {
  attendees: number;
  games: string[];
  tournaments: { name: string; game: string; time?: string }[];
  consoles: { name: string; count: number }[];
};

// TODO: Replace with real DB/API call
const MOCK_LANS: Record<string, LanDetail> = {
  'lan-006': {
    id: 'lan-006',
    title: 'Winter LAN Bash',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
    location: 'Makerspace',
    description: 'A cozy winter get-together with CS2, Valorant and Jackbox in the late hours.',
    coverImage: '/lan-cover-2.jpg',
    attendees: 18,
    games: ['Counter-Strike 2', 'Valorant', 'Trackmania', 'Jackbox Party Pack'],
    tournaments: [
      { name: 'CS2 5v5 Bracket', game: 'Counter-Strike 2', time: '18:00' },
      { name: 'Trackmania Time Attack', game: 'Trackmania', time: '21:00' }
    ],
    consoles: [
      { name: 'PC Setups', count: 20 },
      { name: 'Nintendo Switch', count: 2 },
      { name: 'PS5', count: 1 }
    ]
  },
  'lan-005': {
    id: 'lan-005',
    title: 'Autumn FragFest',
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString(),
    location: 'Community Hall',
    description: 'CS2, Valorant, Trackmania night. BYO rig and snacks.',
    coverImage: '/lan-cover-2.jpg',
    attendees: 24,
    games: ['Counter-Strike 2', 'Valorant', 'Rocket League'],
    tournaments: [
      { name: 'Valorant 5v5', game: 'Valorant', time: '19:00' },
      { name: 'Rocket League 2v2', game: 'Rocket League', time: '22:00' }
    ],
    consoles: [
      { name: 'PC Setups', count: 30 },
      { name: 'Switch Docks', count: 3 }
    ]
  },
  'lan-004': {
    id: 'lan-004',
    title: 'Summer Night LAN',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    location: 'Garage HQ',
    description: 'Pizza, racing, and party games.',
    coverImage: '/lan-cover-2.jpg',
    attendees: 21,
    games: ['Mario Kart 8', 'Gang Beasts', 'Overcooked! 2'],
    tournaments: [{ name: 'Mario Kart Cup', game: 'Mario Kart 8', time: '20:00' }],
    consoles: [
      { name: 'Nintendo Switch', count: 3 },
      { name: 'PC Setups', count: 10 }
    ]
  },
  'lan-003': {
    id: 'lan-003',
    title: 'Spring Bootcamp',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    location: 'LAN Lounge',
    description: 'Practice bracket + casual matches.',
    coverImage: '/lan-cover-2.jpg',
    attendees: 17,
    games: ['CS2', 'Apex Legends', 'Smash Ultimate'],
    tournaments: [{ name: 'Smash Singles', game: 'Smash Ultimate', time: '19:30' }],
    consoles: [
      { name: 'PC Setups', count: 12 },
      { name: 'Nintendo Switch', count: 2 }
    ]
  }
};

export const load: PageLoad = async ({ params }) => {
  const id = params.slug;
  const lan = MOCK_LANS[id];
  if (!lan) throw error(404, 'LAN not found');
  return { lan };
};
