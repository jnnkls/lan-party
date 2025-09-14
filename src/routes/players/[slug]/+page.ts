import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Rarity } from '$lib/components/UserCard.svelte';

export type PlayerDetail = {
  id: string;
  username: string;
  age?: number;
  avatarUrl?: string;
  title?: string;
  rarity?: Rarity;
  attendanceCount?: number;
  winStreak?: number;
  consoleCount?: number;
  rank?: number;
  consoles?: { name: string; count: number }[];
  attendedLANs?: { id: string; title: string; date: string; coverImage?: string; attendees?: number }[];
  tournaments?: { id: string; name: string; game: string; lanId?: string; placement?: number; result?: string }[];
};

const MOCK_PLAYERS: Record<string, PlayerDetail> = {
  u1: {
    id: 'u1', username: 'FragMaster', avatarUrl: 'https://i.pravatar.cc/100?img=68', title: 'Tekken King', rarity: 'legendary',
    attendanceCount: 14, winStreak: 6, consoleCount: 3, rank: 1,
    consoles: [
      { name: 'PC', count: 1 },
      { name: 'PS5', count: 1 },
      { name: 'Nintendo Switch', count: 1 }
    ],
    attendedLANs: [
      { id: 'lan-006', title: 'Winter LAN Bash', date: new Date(Date.now() + 1000*60*60*24*7).toISOString(), coverImage: '/lan-cover-2.jpg', attendees: 18 },
      { id: 'lan-005', title: 'Autumn FragFest', date: new Date(Date.now() + 1000*60*60*24*14).toISOString(), coverImage: '/lan-cover-2.jpg', attendees: 24 },
      { id: 'lan-004', title: 'Summer Night LAN', date: new Date(Date.now() - 1000*60*60*24*30).toISOString(), coverImage: '/lan-cover-2.jpg', attendees: 21 }
    ],
    tournaments: [
      { id: 't1', name: 'CS2 5v5 Bracket', game: 'Counter-Strike 2', lanId: 'lan-006', placement: 1 },
      { id: 't2', name: 'Trackmania Time Attack', game: 'Trackmania', lanId: 'lan-006', placement: 5 },
      { id: 't3', name: 'Valorant 5v5', game: 'Valorant', lanId: 'lan-005', placement: 2 }
    ]
  },
  u2: {
    id: 'u2', username: 'PixelQueen', avatarUrl: 'https://i.pravatar.cc/100?img=32', title: 'Smash Diva', rarity: 'epic',
    attendanceCount: 12, winStreak: 4, consoleCount: 2, rank: 2,
    consoles: [ { name: 'PC', count: 1 }, { name: 'Nintendo Switch', count: 1 } ],
    attendedLANs: [
      { id: 'lan-005', title: 'Autumn FragFest', date: new Date(Date.now() + 1000*60*60*24*14).toISOString(), coverImage: '/lan-cover-2.jpg', attendees: 24 },
      { id: 'lan-004', title: 'Summer Night LAN', date: new Date(Date.now() - 1000*60*60*24*30).toISOString(), coverImage: '/lan-cover-2.jpg', attendees: 21 }
    ],
    tournaments: [
      { id: 't4', name: 'Smash Singles', game: 'Smash Ultimate', lanId: 'lan-004', placement: 1 },
      { id: 't5', name: 'Rocket League 2v2', game: 'Rocket League', lanId: 'lan-005', placement: 3 }
    ]
  },
  u3: {
    id: 'u3', username: 'NoScope', avatarUrl: 'https://i.pravatar.cc/100?img=12', title: 'CS2 Ace', rarity: 'rare',
    attendanceCount: 9, winStreak: 3, consoleCount: 1, rank: 3,
    consoles: [ { name: 'PC', count: 1 } ],
    attendedLANs: [ { id: 'lan-004', title: 'Summer Night LAN', date: new Date(Date.now() - 1000*60*60*24*30).toISOString(), coverImage: '/lan-cover-2.jpg', attendees: 21 } ],
    tournaments: [ { id: 't6', name: 'CS2 Aim Challenge', game: 'Counter-Strike 2', lanId: 'lan-004', placement: 4 } ]
  }
};

export const load: PageLoad = async ({ params }) => {
  const id = params.slug;
  const player = MOCK_PLAYERS[id];
  if (!player) throw error(404, 'Player not found');
  return { player };
};
