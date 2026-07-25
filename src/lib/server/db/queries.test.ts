import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq, inArray } from 'drizzle-orm';
import { db } from './index';
import * as table from './schema';
import { DEFAULT_TENANT_ID } from '../tenant';
import {
	getLanDetail,
	getLanOverviews,
	getLeaderboard,
	getPlayerDetail,
	getPlayers
} from './queries';

// Integration tests against a real PostgreSQL instance (no mocked DB) — see
// docs/testing.md. DATABASE_URL should point at a disposable database, but
// every delete below is scoped to exactly the fixture rows this file creates
// (never a blanket `db.delete(table.x)`) specifically so that running these
// tests against a database that also holds real/seeded data — e.g. a shared
// dev instance, not just CI's throwaway container — can't wipe it. An earlier
// version of this file used unscoped deletes and did exactly that the first
// time it ran against a real seeded database.

const OTHER_TENANT_ID = 'other-tenant-test';
const TEST_GAME_IDS = ['test-game-cs2', 'test-game-trackmania', 'test-game-other'];
const TEST_PLAYER_IDS = ['test-p1', 'test-p2', 'test-p-other'];
const TEST_LAN_IDS = ['test-lan-1', 'test-lan-other'];
const TEST_ACHIEVEMENT_ID = 'test-ach-1';
const TEST_TOURNAMENT_ID = 'test-t1';
const TEST_MATCH_ID = 'test-m1';

beforeAll(async () => {
	// DEFAULT_TENANT_ID is shared across test files (each test file may run in
	// its own worker against the same database) — insert idempotently and
	// never delete it below, or other suites relying on it can fail depending
	// on file execution order.
	await db
		.insert(table.tenant)
		.values({ id: DEFAULT_TENANT_ID, name: 'Default', slug: 'default', createdAt: new Date() })
		.onConflictDoNothing();
	await db
		.insert(table.tenant)
		.values({
			id: OTHER_TENANT_ID,
			name: 'Other Tenant',
			slug: 'other-tenant',
			createdAt: new Date()
		})
		.onConflictDoNothing();

	await db.insert(table.game).values([
		{ id: 'test-game-cs2', tenantId: DEFAULT_TENANT_ID, name: 'Counter-Strike 2', platform: 'PC' },
		{
			id: 'test-game-trackmania',
			tenantId: DEFAULT_TENANT_ID,
			name: 'Trackmania',
			platform: 'PC'
		},
		{ id: 'test-game-other', tenantId: OTHER_TENANT_ID, name: 'Other Tenant Game', platform: 'PC' }
	]);

	await db.insert(table.playerProfile).values([
		{
			id: 'test-p1',
			tenantId: DEFAULT_TENANT_ID,
			username: 'TestFragMaster',
			activeTitle: 'Tester',
			rarity: 'epic',
			xp: 900,
			longestStreak: 4
		},
		{
			id: 'test-p2',
			tenantId: DEFAULT_TENANT_ID,
			username: 'TestNoScope',
			rarity: 'common',
			xp: 300,
			longestStreak: 1
		},
		{
			id: 'test-p-other',
			tenantId: OTHER_TENANT_ID,
			username: 'OtherTenantPlayer',
			rarity: 'common',
			xp: 99999,
			longestStreak: 1
		}
	]);

	await db.insert(table.lanParty).values([
		{
			id: 'test-lan-1',
			tenantId: DEFAULT_TENANT_ID,
			title: 'Test LAN',
			description: 'A test LAN',
			theme: 'Testing',
			location: 'Test Room',
			coverImage: null,
			startsAt: new Date('2026-01-01T18:00:00Z'),
			endsAt: null,
			status: 'expired'
		},
		{
			id: 'test-lan-other',
			tenantId: OTHER_TENANT_ID,
			title: 'Other Tenant LAN',
			description: null,
			theme: null,
			location: null,
			coverImage: null,
			startsAt: new Date('2026-01-01T18:00:00Z'),
			endsAt: null,
			status: 'future'
		}
	]);

	await db.insert(table.lanAttendance).values([
		{
			lanId: 'test-lan-1',
			playerId: 'test-p1',
			joinedAt: new Date('2026-01-01T17:30:00Z'),
			checkedIn: true,
			xpAwarded: 100
		},
		{
			lanId: 'test-lan-1',
			playerId: 'test-p2',
			joinedAt: new Date('2026-01-01T17:30:00Z'),
			checkedIn: true,
			xpAwarded: 100
		}
	]);

	await db.insert(table.lanGame).values([
		{ lanId: 'test-lan-1', gameId: 'test-game-cs2' },
		{ lanId: 'test-lan-1', gameId: 'test-game-trackmania' }
	]);

	await db
		.insert(table.playerGame)
		.values([{ playerId: 'test-p1', gameId: 'test-game-cs2', platform: null, notes: null }]);

	await db.insert(table.achievement).values([
		{
			id: 'test-ach-1',
			tenantId: DEFAULT_TENANT_ID,
			name: 'Test Achievement',
			description: 'Earned in a test',
			xp: 25,
			titleRewardId: null
		}
	]);
	await db.insert(table.playerAchievement).values([
		{
			playerId: 'test-p1',
			achievementId: 'test-ach-1',
			earnedAt: new Date('2026-01-01T00:00:00Z')
		}
	]);

	await db.insert(table.tournament).values([
		{
			id: 'test-t1',
			tenantId: DEFAULT_TENANT_ID,
			lanId: 'test-lan-1',
			gameId: 'test-game-cs2',
			name: 'Test Bracket',
			startsAt: null,
			winnerPlayerId: 'test-p1'
		}
	]);

	await db.insert(table.tournamentMatch).values([
		{
			id: 'test-m1',
			tournamentId: 'test-t1',
			round: 1,
			playerAId: 'test-p1',
			playerBId: 'test-p2',
			winnerPlayerId: 'test-p1',
			score: '13:5'
		}
	]);
});

afterAll(async () => {
	await db.delete(table.tournamentMatch).where(eq(table.tournamentMatch.id, TEST_MATCH_ID));
	await db.delete(table.tournament).where(eq(table.tournament.id, TEST_TOURNAMENT_ID));
	await db
		.delete(table.playerAchievement)
		.where(eq(table.playerAchievement.achievementId, TEST_ACHIEVEMENT_ID));
	await db.delete(table.achievement).where(eq(table.achievement.id, TEST_ACHIEVEMENT_ID));
	await db.delete(table.playerGame).where(inArray(table.playerGame.playerId, TEST_PLAYER_IDS));
	await db.delete(table.lanGame).where(inArray(table.lanGame.lanId, TEST_LAN_IDS));
	await db.delete(table.lanAttendance).where(inArray(table.lanAttendance.lanId, TEST_LAN_IDS));
	await db.delete(table.lanParty).where(inArray(table.lanParty.id, TEST_LAN_IDS));
	await db.delete(table.playerProfile).where(inArray(table.playerProfile.id, TEST_PLAYER_IDS));
	await db.delete(table.game).where(inArray(table.game.id, TEST_GAME_IDS));
	// Leave DEFAULT_TENANT_ID alone — other integration test files rely on it
	// existing too. Only clean up the tenant this file created.
	await db.delete(table.tenant).where(eq(table.tenant.id, OTHER_TENANT_ID));
});

describe('getLanOverviews', () => {
	it('only returns LANs for the default tenant', async () => {
		const lans = await getLanOverviews();
		const ids = lans.map((l) => l.id);
		expect(ids).toContain('test-lan-1');
		expect(ids).not.toContain('test-lan-other');
	});

	it('includes attendee counts and games', async () => {
		const lans = await getLanOverviews();
		const lan = lans.find((l) => l.id === 'test-lan-1')!;
		expect(lan.attendees).toBe(2);
		expect(lan.games).toEqual(expect.arrayContaining(['Counter-Strike 2', 'Trackmania']));
	});
});

describe('getLanDetail', () => {
	it('returns full detail including attendee names and tournaments', async () => {
		const lan = await getLanDetail('test-lan-1');
		expect(lan).not.toBeNull();
		expect(lan!.attendeeNames.sort()).toEqual(['TestFragMaster', 'TestNoScope']);
		expect(lan!.tournaments).toHaveLength(1);
		expect(lan!.tournaments[0].winner).toBe('TestFragMaster');
		expect(lan!.tournaments[0].matches?.[0]).toMatchObject({
			playerA: 'TestFragMaster',
			playerB: 'TestNoScope',
			winner: 'TestFragMaster',
			score: '13:5'
		});
	});

	it('returns null for a LAN outside the default tenant', async () => {
		expect(await getLanDetail('test-lan-other')).toBeNull();
	});

	it('returns null for an unknown id', async () => {
		expect(await getLanDetail('does-not-exist')).toBeNull();
	});

	it('reports game coverage: owned games list their owners, unowned games are empty', async () => {
		const lan = await getLanDetail('test-lan-1');
		const cs2 = lan!.gameCoverage.find((g) => g.name === 'Counter-Strike 2')!;
		const trackmania = lan!.gameCoverage.find((g) => g.name === 'Trackmania')!;

		expect(cs2.ownedBy).toEqual(['TestFragMaster']);
		expect(trackmania.ownedBy).toEqual([]);
	});
});

describe('getPlayers', () => {
	it('ranks players by xp descending and scopes to the default tenant', async () => {
		const players = await getPlayers();
		const ids = players.map((p) => p.id);
		expect(ids).not.toContain('test-p-other');

		const p1 = players.find((p) => p.id === 'test-p1')!;
		const p2 = players.find((p) => p.id === 'test-p2')!;
		expect(p1.rank).toBeLessThan(p2.rank!);
		expect(p1.attendanceCount).toBe(1);
	});

	it('computes xp from attendance xpAwarded plus earned achievement xp, ignoring the stored column', async () => {
		const players = await getPlayers();
		const p1 = players.find((p) => p.id === 'test-p1')!;
		const p2 = players.find((p) => p.id === 'test-p2')!;

		// p1: 100 (lan attendance) + 25 (test-ach-1) = 125 — not the seeded 900.
		expect(p1.xp).toBe(125);
		// p2: 100 (lan attendance) + 0 (no achievements) — not the seeded 300.
		expect(p2.xp).toBe(100);
	});

	it('includes the player_game library', async () => {
		const players = await getPlayers();
		const p1 = players.find((p) => p.id === 'test-p1')!;
		const p2 = players.find((p) => p.id === 'test-p2')!;

		expect(p1.games).toEqual([{ name: 'Counter-Strike 2', platform: 'PC' }]);
		expect(p2.games).toEqual([]);
	});
});

describe('getPlayerDetail', () => {
	it('includes tournament placement for the winner', async () => {
		const detail = await getPlayerDetail('test-p1');
		expect(detail).not.toBeNull();
		expect(detail!.tournaments?.[0].placement).toBe(1);
	});

	it('has no placement for a non-winning participant', async () => {
		const detail = await getPlayerDetail('test-p2');
		expect(detail!.tournaments?.[0].placement).toBeUndefined();
	});

	it('returns null for an unknown player', async () => {
		expect(await getPlayerDetail('does-not-exist')).toBeNull();
	});
});

describe('getLeaderboard', () => {
	it('does not leak tenant-scoping or auth fields, only id/username/avatar/score', async () => {
		const board = await getLeaderboard();
		const entry = board.find((e) => e.id === 'test-p1')!;
		expect(entry).toEqual({
			id: 'test-p1',
			username: 'TestFragMaster',
			avatarUrl: undefined,
			score: 125 // computed xp (100 attendance + 25 achievement), not the seeded 900
		});
	});
});
