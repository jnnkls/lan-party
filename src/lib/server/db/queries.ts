import { count, eq, inArray, sum } from 'drizzle-orm';
import { db } from './index';
import * as table from './schema';
import { DEFAULT_TENANT_ID } from '../tenant';
import type {
	Achievement,
	GameCoverage,
	LanDetail,
	LanOverview,
	LeaderboardEntry,
	OwnedGame,
	PlayerDetail,
	TournamentOverview
} from '$lib/types';

function formatTime(date: Date) {
	return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

async function groupByLan<T extends { lanId: string }>(rows: T[]): Promise<Map<string, T[]>> {
	const map = new Map<string, T[]>();
	for (const row of rows) {
		const list = map.get(row.lanId);
		if (list) list.push(row);
		else map.set(row.lanId, [row]);
	}
	return map;
}

export async function getLanOverviews(): Promise<LanOverview[]> {
	const lans = await db
		.select()
		.from(table.lanParty)
		.where(eq(table.lanParty.tenantId, DEFAULT_TENANT_ID));

	if (lans.length === 0) return [];
	const lanIds = lans.map((lan) => lan.id);

	const [attendanceCounts, games, consoles] = await Promise.all([
		db
			.select({ lanId: table.lanAttendance.lanId, count: count() })
			.from(table.lanAttendance)
			.where(inArray(table.lanAttendance.lanId, lanIds))
			.groupBy(table.lanAttendance.lanId),
		db
			.select({ lanId: table.lanGame.lanId, name: table.game.name })
			.from(table.lanGame)
			.innerJoin(table.game, eq(table.lanGame.gameId, table.game.id))
			.where(inArray(table.lanGame.lanId, lanIds)),
		db
			.select({ lanId: table.lanConsole.lanId, name: table.consoleDevice.name })
			.from(table.lanConsole)
			.innerJoin(table.consoleDevice, eq(table.lanConsole.consoleId, table.consoleDevice.id))
			.where(inArray(table.lanConsole.lanId, lanIds))
	]);

	const attendanceByLan = new Map(attendanceCounts.map((row) => [row.lanId, row.count]));
	const gamesByLan = await groupByLan(games);
	const consolesByLan = await groupByLan(consoles);

	return lans.map((lan) => ({
		id: lan.id,
		title: lan.title,
		date: lan.startsAt.toISOString(),
		location: lan.location ?? undefined,
		description: lan.description ?? undefined,
		coverImage: lan.coverImage ?? undefined,
		attendees: attendanceByLan.get(lan.id) ?? 0,
		status: lan.status,
		theme: lan.theme ?? undefined,
		games: (gamesByLan.get(lan.id) ?? []).map((row) => row.name),
		consoleNames: (consolesByLan.get(lan.id) ?? []).map((row) => row.name)
	}));
}

export const getHomeEvents = getLanOverviews;

export async function getLanDetail(id: string): Promise<LanDetail | null> {
	const [lan] = await db.select().from(table.lanParty).where(eq(table.lanParty.id, id)).limit(1);
	if (!lan || lan.tenantId !== DEFAULT_TENANT_ID) return null;

	const [attendeeRows, gameRows, consoleRows] = await Promise.all([
		db
			.select({ playerId: table.playerProfile.id, username: table.playerProfile.username })
			.from(table.lanAttendance)
			.innerJoin(table.playerProfile, eq(table.lanAttendance.playerId, table.playerProfile.id))
			.where(eq(table.lanAttendance.lanId, id)),
		db
			.select({ name: table.game.name })
			.from(table.lanGame)
			.innerJoin(table.game, eq(table.lanGame.gameId, table.game.id))
			.where(eq(table.lanGame.lanId, id)),
		db
			.select({ name: table.consoleDevice.name, count: table.lanConsole.count })
			.from(table.lanConsole)
			.innerJoin(table.consoleDevice, eq(table.lanConsole.consoleId, table.consoleDevice.id))
			.where(eq(table.lanConsole.lanId, id))
	]);

	const [tournaments, gameCoverage] = await Promise.all([
		getTournamentsForLans([id]),
		getGameCoverageForAttendees(
			gameRows.map((row) => row.name),
			attendeeRows.map((row) => row.playerId)
		)
	]);

	return {
		id: lan.id,
		title: lan.title,
		date: lan.startsAt.toISOString(),
		location: lan.location ?? undefined,
		description: lan.description ?? undefined,
		coverImage: lan.coverImage ?? undefined,
		status: lan.status,
		theme: lan.theme ?? undefined,
		attendees: attendeeRows.length,
		attendeeNames: attendeeRows.map((row) => row.username),
		games: gameRows.map((row) => row.name),
		consoleNames: consoleRows.map((row) => row.name),
		consoles: consoleRows,
		tournaments: tournaments.get(id) ?? [],
		gameCoverage
	};
}

// For each of a LAN's planned games, which attendees (if any) already own it —
// lets the UI show "covered by X" vs "needed" instead of just a flat game list.
async function getGameCoverageForAttendees(
	gameNames: string[],
	attendeePlayerIds: string[]
): Promise<GameCoverage[]> {
	if (gameNames.length === 0 || attendeePlayerIds.length === 0) {
		return gameNames.map((name) => ({ name, ownedBy: [] }));
	}

	const rows = await db
		.select({ username: table.playerProfile.username, gameName: table.game.name })
		.from(table.playerGame)
		.innerJoin(table.game, eq(table.playerGame.gameId, table.game.id))
		.innerJoin(table.playerProfile, eq(table.playerGame.playerId, table.playerProfile.id))
		.where(inArray(table.playerGame.playerId, attendeePlayerIds));

	const ownersByGame = new Map<string, string[]>();
	for (const row of rows) {
		const list = ownersByGame.get(row.gameName);
		if (list) list.push(row.username);
		else ownersByGame.set(row.gameName, [row.username]);
	}

	return gameNames.map((name) => ({ name, ownedBy: ownersByGame.get(name) ?? [] }));
}

async function getTournamentsForLans(lanIds: string[]): Promise<Map<string, TournamentOverview[]>> {
	const tournaments = await db
		.select({
			id: table.tournament.id,
			lanId: table.tournament.lanId,
			name: table.tournament.name,
			startsAt: table.tournament.startsAt,
			winnerPlayerId: table.tournament.winnerPlayerId,
			gameName: table.game.name
		})
		.from(table.tournament)
		.innerJoin(table.game, eq(table.tournament.gameId, table.game.id))
		.where(inArray(table.tournament.lanId, lanIds));

	if (tournaments.length === 0) return new Map();
	const tournamentIds = tournaments.map((t) => t.id);

	const matches = await db
		.select({
			id: table.tournamentMatch.id,
			tournamentId: table.tournamentMatch.tournamentId,
			round: table.tournamentMatch.round,
			score: table.tournamentMatch.score,
			playerAId: table.tournamentMatch.playerAId,
			playerBId: table.tournamentMatch.playerBId,
			winnerPlayerId: table.tournamentMatch.winnerPlayerId
		})
		.from(table.tournamentMatch)
		.where(inArray(table.tournamentMatch.tournamentId, tournamentIds));

	const playerIds = new Set<string>();
	for (const t of tournaments) if (t.winnerPlayerId) playerIds.add(t.winnerPlayerId);
	for (const m of matches) {
		if (m.playerAId) playerIds.add(m.playerAId);
		if (m.playerBId) playerIds.add(m.playerBId);
		if (m.winnerPlayerId) playerIds.add(m.winnerPlayerId);
	}
	const usernameById = await getUsernameMap([...playerIds]);

	const matchesByTournament = new Map<string, typeof matches>();
	for (const m of matches) {
		const list = matchesByTournament.get(m.tournamentId);
		if (list) list.push(m);
		else matchesByTournament.set(m.tournamentId, [m]);
	}

	const result = new Map<string, TournamentOverview[]>();
	for (const t of tournaments) {
		const overview: TournamentOverview = {
			id: t.id,
			name: t.name,
			game: t.gameName,
			lanId: t.lanId,
			time: t.startsAt ? formatTime(t.startsAt) : undefined,
			winner: t.winnerPlayerId ? usernameById.get(t.winnerPlayerId) : undefined,
			matches: (matchesByTournament.get(t.id) ?? []).map((m) => ({
				id: m.id,
				round: m.round,
				playerA: m.playerAId ? (usernameById.get(m.playerAId) ?? 'TBD') : 'TBD',
				playerB: m.playerBId ? (usernameById.get(m.playerBId) ?? 'TBD') : 'TBD',
				winner: m.winnerPlayerId ? usernameById.get(m.winnerPlayerId) : undefined,
				score: m.score ?? undefined
			}))
		};
		const list = result.get(t.lanId);
		if (list) list.push(overview);
		else result.set(t.lanId, [overview]);
	}
	return result;
}

async function getUsernameMap(playerIds: string[]): Promise<Map<string, string>> {
	if (playerIds.length === 0) return new Map();
	const rows = await db
		.select({ id: table.playerProfile.id, username: table.playerProfile.username })
		.from(table.playerProfile)
		.where(inArray(table.playerProfile.id, playerIds));
	return new Map(rows.map((row) => [row.id, row.username]));
}

async function getAllPlayers() {
	return db
		.select()
		.from(table.playerProfile)
		.where(eq(table.playerProfile.tenantId, DEFAULT_TENANT_ID));
}

async function getGearForPlayers(playerIds: string[]) {
	if (playerIds.length === 0) return new Map<string, { name: string; count: number }[]>();
	const rows = await db
		.select({
			playerId: table.playerGear.playerId,
			name: table.consoleDevice.name,
			count: table.playerGear.count
		})
		.from(table.playerGear)
		.innerJoin(table.consoleDevice, eq(table.playerGear.consoleId, table.consoleDevice.id))
		.where(inArray(table.playerGear.playerId, playerIds));
	const map = new Map<string, { name: string; count: number }[]>();
	for (const row of rows) {
		const list = map.get(row.playerId);
		const item = { name: row.name, count: row.count };
		if (list) list.push(item);
		else map.set(row.playerId, [item]);
	}
	return map;
}

async function getGamesForPlayers(playerIds: string[]) {
	if (playerIds.length === 0) return new Map<string, OwnedGame[]>();
	const rows = await db
		.select({
			playerId: table.playerGame.playerId,
			name: table.game.name,
			platform: table.playerGame.platform,
			gamePlatform: table.game.platform
		})
		.from(table.playerGame)
		.innerJoin(table.game, eq(table.playerGame.gameId, table.game.id))
		.where(inArray(table.playerGame.playerId, playerIds));

	const map = new Map<string, OwnedGame[]>();
	for (const row of rows) {
		const item: OwnedGame = {
			name: row.name,
			platform: row.platform ?? row.gamePlatform ?? undefined
		};
		const list = map.get(row.playerId);
		if (list) list.push(item);
		else map.set(row.playerId, [item]);
	}
	return map;
}

async function getTitlesForPlayers(playerIds: string[]) {
	if (playerIds.length === 0) return new Map<string, string[]>();
	const rows = await db
		.select({ playerId: table.playerTitle.playerId, name: table.title.name })
		.from(table.playerTitle)
		.innerJoin(table.title, eq(table.playerTitle.titleId, table.title.id))
		.where(inArray(table.playerTitle.playerId, playerIds));
	const map = new Map<string, string[]>();
	for (const row of rows) {
		const list = map.get(row.playerId);
		if (list) list.push(row.name);
		else map.set(row.playerId, [row.name]);
	}
	return map;
}

async function getAchievementsForPlayers(playerIds: string[]) {
	if (playerIds.length === 0) return new Map<string, Achievement[]>();
	const rows = await db
		.select({
			playerId: table.playerAchievement.playerId,
			id: table.achievement.id,
			name: table.achievement.name,
			description: table.achievement.description,
			xp: table.achievement.xp,
			titleRewardId: table.achievement.titleRewardId
		})
		.from(table.playerAchievement)
		.innerJoin(table.achievement, eq(table.playerAchievement.achievementId, table.achievement.id))
		.where(inArray(table.playerAchievement.playerId, playerIds));

	const titleRewardIds = [
		...new Set(rows.map((r) => r.titleRewardId).filter((id): id is string => !!id))
	];
	const titleNameById =
		titleRewardIds.length > 0
			? new Map(
					(
						await db
							.select({ id: table.title.id, name: table.title.name })
							.from(table.title)
							.where(inArray(table.title.id, titleRewardIds))
					).map((t) => [t.id, t.name])
				)
			: new Map<string, string>();

	const map = new Map<string, Achievement[]>();
	for (const row of rows) {
		const item: Achievement = {
			id: row.id,
			name: row.name,
			description: row.description,
			xp: row.xp,
			titleReward: row.titleRewardId ? titleNameById.get(row.titleRewardId) : undefined
		};
		const list = map.get(row.playerId);
		if (list) list.push(item);
		else map.set(row.playerId, [item]);
	}
	return map;
}

async function getAttendedLansForPlayers(playerIds: string[]) {
	if (playerIds.length === 0) return new Map<string, LanOverview[]>();
	const rows = await db
		.select({
			playerId: table.lanAttendance.playerId,
			id: table.lanParty.id,
			title: table.lanParty.title,
			startsAt: table.lanParty.startsAt,
			location: table.lanParty.location,
			description: table.lanParty.description,
			coverImage: table.lanParty.coverImage,
			status: table.lanParty.status,
			theme: table.lanParty.theme
		})
		.from(table.lanAttendance)
		.innerJoin(table.lanParty, eq(table.lanAttendance.lanId, table.lanParty.id))
		.where(inArray(table.lanAttendance.playerId, playerIds));

	const lanIds = [...new Set(rows.map((row) => row.id))];
	const [attendanceCounts, games, consoles] = await Promise.all([
		db
			.select({ lanId: table.lanAttendance.lanId, count: count() })
			.from(table.lanAttendance)
			.where(inArray(table.lanAttendance.lanId, lanIds))
			.groupBy(table.lanAttendance.lanId),
		db
			.select({ lanId: table.lanGame.lanId, name: table.game.name })
			.from(table.lanGame)
			.innerJoin(table.game, eq(table.lanGame.gameId, table.game.id))
			.where(inArray(table.lanGame.lanId, lanIds)),
		db
			.select({ lanId: table.lanConsole.lanId, name: table.consoleDevice.name })
			.from(table.lanConsole)
			.innerJoin(table.consoleDevice, eq(table.lanConsole.consoleId, table.consoleDevice.id))
			.where(inArray(table.lanConsole.lanId, lanIds))
	]);

	const attendanceByLan = new Map(attendanceCounts.map((row) => [row.lanId, row.count]));
	const gamesByLan = await groupByLan(games);
	const consolesByLan = await groupByLan(consoles);

	const map = new Map<string, LanOverview[]>();
	for (const row of rows) {
		const overview: LanOverview = {
			id: row.id,
			title: row.title,
			date: row.startsAt.toISOString(),
			location: row.location ?? undefined,
			description: row.description ?? undefined,
			coverImage: row.coverImage ?? undefined,
			status: row.status,
			theme: row.theme ?? undefined,
			attendees: attendanceByLan.get(row.id) ?? 0,
			games: (gamesByLan.get(row.id) ?? []).map((g) => g.name),
			consoleNames: (consolesByLan.get(row.id) ?? []).map((c) => c.name)
		};
		const list = map.get(row.playerId);
		if (list) list.push(overview);
		else map.set(row.playerId, [overview]);
	}
	return map;
}

// A player's "current" win streak isn't tracked separately from their longest
// streak yet — mirrors the placeholder heuristic the mock data used.
function winStreakFrom(longestStreak: number) {
	return Math.max(1, Math.min(longestStreak, 6));
}

// Total XP is computed live from what a player has actually earned — LAN
// attendance awards plus unlocked achievements — rather than trusted from the
// player_profile.xp column, so it can never drift from real history.
async function getXpForPlayers(playerIds: string[]): Promise<Map<string, number>> {
	if (playerIds.length === 0) return new Map();

	const [attendanceXp, achievementXp] = await Promise.all([
		db
			.select({ playerId: table.lanAttendance.playerId, total: sum(table.lanAttendance.xpAwarded) })
			.from(table.lanAttendance)
			.where(inArray(table.lanAttendance.playerId, playerIds))
			.groupBy(table.lanAttendance.playerId),
		db
			.select({ playerId: table.playerAchievement.playerId, total: sum(table.achievement.xp) })
			.from(table.playerAchievement)
			.innerJoin(table.achievement, eq(table.playerAchievement.achievementId, table.achievement.id))
			.where(inArray(table.playerAchievement.playerId, playerIds))
			.groupBy(table.playerAchievement.playerId)
	]);

	const xpByPlayer = new Map<string, number>();
	for (const row of attendanceXp) {
		xpByPlayer.set(row.playerId, (xpByPlayer.get(row.playerId) ?? 0) + Number(row.total ?? 0));
	}
	for (const row of achievementXp) {
		xpByPlayer.set(row.playerId, (xpByPlayer.get(row.playerId) ?? 0) + Number(row.total ?? 0));
	}
	return xpByPlayer;
}

export async function getPlayers(): Promise<PlayerDetail[]> {
	const players = await getAllPlayers();
	if (players.length === 0) return [];
	const playerIds = players.map((p) => p.id);

	const [
		gearByPlayer,
		gamesByPlayer,
		titlesByPlayer,
		achievementsByPlayer,
		lansByPlayer,
		attendanceCounts,
		xpByPlayer
	] = await Promise.all([
		getGearForPlayers(playerIds),
		getGamesForPlayers(playerIds),
		getTitlesForPlayers(playerIds),
		getAchievementsForPlayers(playerIds),
		getAttendedLansForPlayers(playerIds),
		db
			.select({ playerId: table.lanAttendance.playerId, count: count() })
			.from(table.lanAttendance)
			.where(inArray(table.lanAttendance.playerId, playerIds))
			.groupBy(table.lanAttendance.playerId),
		getXpForPlayers(playerIds)
	]);
	const attendanceByPlayer = new Map(attendanceCounts.map((row) => [row.playerId, row.count]));

	return players
		.map((p) => {
			const consoles = gearByPlayer.get(p.id) ?? [];
			return {
				id: p.id,
				username: p.username,
				avatarUrl: p.avatarUrl ?? undefined,
				title: p.activeTitle ?? undefined,
				titles: titlesByPlayer.get(p.id) ?? [],
				rarity: p.rarity,
				xp: xpByPlayer.get(p.id) ?? 0,
				achievements: achievementsByPlayer.get(p.id) ?? [],
				attendanceCount: attendanceByPlayer.get(p.id) ?? 0,
				winStreak: winStreakFrom(p.longestStreak),
				longestStreak: p.longestStreak,
				consoleCount: consoles.reduce((sum, c) => sum + c.count, 0),
				consoles,
				games: gamesByPlayer.get(p.id) ?? [],
				attendedLANs: lansByPlayer.get(p.id) ?? []
			} satisfies PlayerDetail;
		})
		.sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
		.map((p, index) => ({ ...p, rank: index + 1 }));
}

export async function getPlayerDetail(id: string): Promise<PlayerDetail | null> {
	const players = await getPlayers();
	const player = players.find((p) => p.id === id);
	if (!player) return null;

	// Fetch both sides separately and merge rather than using `or()` — keeps this
	// consistent with the plain eq/inArray style used elsewhere in this file.
	const [matchRowsA, matchRowsB] = await Promise.all([
		db
			.select({ tournamentId: table.tournamentMatch.tournamentId })
			.from(table.tournamentMatch)
			.where(eq(table.tournamentMatch.playerAId, id)),
		db
			.select({ tournamentId: table.tournamentMatch.tournamentId })
			.from(table.tournamentMatch)
			.where(eq(table.tournamentMatch.playerBId, id))
	]);

	const tournamentIds = [
		...new Set([...matchRowsA.map((m) => m.tournamentId), ...matchRowsB.map((m) => m.tournamentId)])
	];
	if (tournamentIds.length === 0) return { ...player, tournaments: [] };

	const tournamentRows = await db
		.select({ id: table.tournament.id, lanId: table.tournament.lanId })
		.from(table.tournament)
		.where(inArray(table.tournament.id, tournamentIds));

	const lanIds = [...new Set(tournamentRows.map((t) => t.lanId))];
	const byLan = await getTournamentsForLans(lanIds);
	const tournaments = [...byLan.values()]
		.flat()
		.filter((t) => tournamentIds.includes(t.id))
		.map((t) => ({
			...t,
			placement: t.winner === player.username ? 1 : undefined
		}));

	return { ...player, tournaments };
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
	const players = await getPlayers();
	return players.map((p) => ({
		id: p.id,
		username: p.username,
		avatarUrl: p.avatarUrl,
		score: p.xp ?? 0
	}));
}
