// This script runs standalone via `tsx` (not through Vite), so it can't use the
// `$env/dynamic/private` alias that src/lib/server/db/index.ts relies on — it
// builds its own short-lived DB connection from process.env instead.
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DEFAULT_TENANT_ID, DEFAULT_TENANT_NAME, DEFAULT_TENANT_SLUG } from '../tenant';
import * as table from './schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema: table });

const now = Date.now();
const day = 1000 * 60 * 60 * 24;

const games = [
	{ id: 'game-cs2', name: 'Counter-Strike 2', platform: 'PC' },
	{ id: 'game-valorant', name: 'Valorant', platform: 'PC' },
	{ id: 'game-trackmania', name: 'Trackmania', platform: 'PC' },
	{ id: 'game-jackbox', name: 'Jackbox Party Pack', platform: 'PC' },
	{ id: 'game-rocket-league', name: 'Rocket League', platform: 'PC' },
	{ id: 'game-smash', name: 'Smash Ultimate', platform: 'Nintendo Switch' },
	{ id: 'game-mario-kart', name: 'Mario Kart 8', platform: 'Nintendo Switch' },
	{ id: 'game-mario-party', name: 'Mario Party', platform: 'Nintendo Switch' },
	{ id: 'game-apex', name: 'Apex Legends', platform: 'PC' }
];

const consoles = [
	{ id: 'console-pc', name: 'PC' },
	{ id: 'console-switch', name: 'Nintendo Switch' },
	{ id: 'console-ps5', name: 'PS5' },
	{ id: 'console-gamecube', name: 'GameCube' },
	{ id: 'console-steam-deck', name: 'Steam Deck' },
	{ id: 'console-controller', name: 'Controller' },
	{ id: 'console-fight-stick', name: 'Fight Stick' },
	{ id: 'console-joycon', name: 'Joy-Con Pair' },
	{ id: 'console-laptop', name: 'Laptop' },
	{ id: 'console-capture-card', name: 'Capture Card' }
];

const titles = [
	'Fresh Spawn',
	'LAN Loyalist',
	'Champion',
	'Tekken King',
	'Smash Diva',
	'CS2 Ace',
	'Valorant Shotcaller',
	'Logistics MVP',
	'Setup Wizard',
	'Ping Whisperer',
	'Meta Analyst',
	'BM Enthusiast',
	'Frame Lord',
	'Aim Lab Champ',
	'Bracket Breaker',
	'Nacho Strategist',
	'Boost Baron',
	'Frame Trapper',
	'Router Whisperer',
	'Blue Shell Dealer',
	'Warmup Wizard',
	'Arcade Bruiser',
	'Snack Dropper',
	'Overtime Hero',
	'Bracket Archivist'
].map((name) => ({ id: `title-${slug(name)}`, name }));

function slug(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function titleId(name: string) {
	const found = titles.find((t) => t.name === name);
	if (!found) throw new Error(`Unknown title: ${name}`);
	return found.id;
}

const achievements = [
	{
		id: 'ach-first-login',
		name: 'Cable Connected',
		description: 'Joined the party manager for the first time.',
		xp: 50,
		titleRewardId: titleId('Fresh Spawn')
	},
	{
		id: 'ach-streak',
		name: 'Never Unplugged',
		description: 'Built a LAN attendance streak.',
		xp: 250,
		titleRewardId: titleId('LAN Loyalist')
	},
	{
		id: 'ach-winner',
		name: 'Bracket Breaker',
		description: 'Won a tournament bracket.',
		xp: 500,
		titleRewardId: titleId('Champion')
	}
];

type PlayerSeed = {
	id: string;
	username: string;
	avatarUrl: string;
	title: string;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
	xp: number;
	longestStreak: number;
	gear: { consoleId: string; count: number }[];
	achievementCount: 1 | 2 | 3;
};

const players: PlayerSeed[] = [
	{
		id: 'u1',
		username: 'FragMaster',
		avatarUrl: 'https://i.pravatar.cc/100?img=68',
		title: 'Tekken King',
		rarity: 'legendary',
		xp: 1850,
		longestStreak: 6,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-ps5', count: 1 },
			{ consoleId: 'console-switch', count: 1 }
		],
		achievementCount: 3
	},
	{
		id: 'u2',
		username: 'PixelQueen',
		avatarUrl: 'https://i.pravatar.cc/100?img=32',
		title: 'Smash Diva',
		rarity: 'epic',
		xp: 1630,
		longestStreak: 4,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-switch', count: 1 }
		],
		achievementCount: 3
	},
	{
		id: 'u3',
		username: 'NoScope',
		avatarUrl: 'https://i.pravatar.cc/100?img=12',
		title: 'CS2 Ace',
		rarity: 'rare',
		xp: 1210,
		longestStreak: 3,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 2
	},
	{
		id: 'u4',
		username: 'LANLegend',
		avatarUrl: 'https://i.pravatar.cc/100?img=23',
		title: 'Valorant Shotcaller',
		rarity: 'epic',
		xp: 1420,
		longestStreak: 2,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-steam-deck', count: 1 }
		],
		achievementCount: 3
	},
	{
		id: 'u5',
		username: 'SnackBringer',
		avatarUrl: 'https://i.pravatar.cc/100?img=5',
		title: 'Logistics MVP',
		rarity: 'common',
		xp: 1320,
		longestStreak: 1,
		gear: [
			{ consoleId: 'console-switch', count: 2 },
			{ consoleId: 'console-gamecube', count: 1 },
			{ consoleId: 'console-ps5', count: 1 },
			{ consoleId: 'console-pc', count: 1 }
		],
		achievementCount: 1
	},
	{
		id: 'u6',
		username: 'CableGuy',
		avatarUrl: 'https://i.pravatar.cc/100?img=7',
		title: 'Setup Wizard',
		rarity: 'rare',
		xp: 980,
		longestStreak: 2,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 2
	},
	{
		id: 'u7',
		username: 'LagWizard',
		avatarUrl: 'https://i.pravatar.cc/100?img=14',
		title: 'Ping Whisperer',
		rarity: 'common',
		xp: 860,
		longestStreak: 1,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-switch', count: 1 }
		],
		achievementCount: 1
	},
	{
		id: 'u8',
		username: 'PatchNotes',
		avatarUrl: 'https://i.pravatar.cc/100?img=9',
		title: 'Meta Analyst',
		rarity: 'rare',
		xp: 1180,
		longestStreak: 3,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-steam-deck', count: 1 }
		],
		achievementCount: 2
	},
	{
		id: 'u9',
		username: 'TeaBag',
		avatarUrl: 'https://i.pravatar.cc/100?img=19',
		title: 'BM Enthusiast',
		rarity: 'epic',
		xp: 1160,
		longestStreak: 5,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 3
	},
	{
		id: 'u10',
		username: 'VSync',
		avatarUrl: 'https://i.pravatar.cc/100?img=44',
		title: 'Frame Lord',
		rarity: 'common',
		xp: 640,
		longestStreak: 1,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 1
	},
	{
		id: 'u11',
		username: 'WarmupOnly',
		avatarUrl: 'https://i.pravatar.cc/100?img=16',
		title: 'Aim Lab Champ',
		rarity: 'rare',
		xp: 520,
		longestStreak: 2,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 2
	},
	{
		id: 'u12',
		username: 'Smurfette',
		avatarUrl: 'https://i.pravatar.cc/100?img=25',
		title: 'Bracket Breaker',
		rarity: 'epic',
		xp: 1260,
		longestStreak: 4,
		gear: [
			{ consoleId: 'console-switch', count: 1 },
			{ consoleId: 'console-pc', count: 1 }
		],
		achievementCount: 3
	},
	{
		id: 'u13',
		username: 'CritSnack',
		avatarUrl: 'https://i.pravatar.cc/100?img=52',
		title: 'Nacho Strategist',
		rarity: 'common',
		xp: 740,
		longestStreak: 2,
		gear: [{ consoleId: 'console-switch', count: 1 }],
		achievementCount: 1
	},
	{
		id: 'u14',
		username: 'RocketDad',
		avatarUrl: 'https://i.pravatar.cc/100?img=53',
		title: 'Boost Baron',
		rarity: 'rare',
		xp: 930,
		longestStreak: 3,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-controller', count: 2 }
		],
		achievementCount: 2
	},
	{
		id: 'u15',
		username: 'ComboKid',
		avatarUrl: 'https://i.pravatar.cc/100?img=54',
		title: 'Frame Trapper',
		rarity: 'epic',
		xp: 1110,
		longestStreak: 4,
		gear: [
			{ consoleId: 'console-ps5', count: 1 },
			{ consoleId: 'console-fight-stick', count: 1 }
		],
		achievementCount: 3
	},
	{
		id: 'u16',
		username: 'PacketLoss',
		avatarUrl: 'https://i.pravatar.cc/100?img=55',
		title: 'Router Whisperer',
		rarity: 'common',
		xp: 430,
		longestStreak: 1,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 1
	},
	{
		id: 'u17',
		username: 'KartBandit',
		avatarUrl: 'https://i.pravatar.cc/100?img=56',
		title: 'Blue Shell Dealer',
		rarity: 'rare',
		xp: 1010,
		longestStreak: 3,
		gear: [
			{ consoleId: 'console-switch', count: 1 },
			{ consoleId: 'console-joycon', count: 2 }
		],
		achievementCount: 2
	},
	{
		id: 'u18',
		username: 'AimToast',
		avatarUrl: 'https://i.pravatar.cc/100?img=57',
		title: 'Warmup Wizard',
		rarity: 'common',
		xp: 610,
		longestStreak: 2,
		gear: [{ consoleId: 'console-pc', count: 1 }],
		achievementCount: 1
	},
	{
		id: 'u19',
		username: 'PixelPunch',
		avatarUrl: 'https://i.pravatar.cc/100?img=58',
		title: 'Arcade Bruiser',
		rarity: 'rare',
		xp: 890,
		longestStreak: 2,
		gear: [
			{ consoleId: 'console-fight-stick', count: 1 },
			{ consoleId: 'console-steam-deck', count: 1 }
		],
		achievementCount: 2
	},
	{
		id: 'u20',
		username: 'LootLlama',
		avatarUrl: 'https://i.pravatar.cc/100?img=59',
		title: 'Snack Dropper',
		rarity: 'common',
		xp: 570,
		longestStreak: 1,
		gear: [{ consoleId: 'console-switch', count: 1 }],
		achievementCount: 1
	},
	{
		id: 'u21',
		username: 'ClutchByte',
		avatarUrl: 'https://i.pravatar.cc/100?img=60',
		title: 'Overtime Hero',
		rarity: 'epic',
		xp: 1370,
		longestStreak: 5,
		gear: [
			{ consoleId: 'console-pc', count: 1 },
			{ consoleId: 'console-ps5', count: 1 }
		],
		achievementCount: 3
	},
	{
		id: 'u22',
		username: 'SavePoint',
		avatarUrl: 'https://i.pravatar.cc/100?img=61',
		title: 'Bracket Archivist',
		rarity: 'rare',
		xp: 780,
		longestStreak: 2,
		gear: [
			{ consoleId: 'console-laptop', count: 1 },
			{ consoleId: 'console-capture-card', count: 1 }
		],
		achievementCount: 2
	}
];

type LanSeed = {
	id: string;
	title: string;
	description: string;
	theme: string;
	location: string;
	coverImage: string;
	startsAt: Date;
	endsAt: Date;
	status: 'expired' | 'ongoing' | 'future';
	gameIds: string[];
	consoles: { consoleId: string; count: number }[];
	attendeePlayerIds: string[];
};

const lans: LanSeed[] = [
	{
		id: 'lan-006',
		title: 'Winter LAN Bash',
		description: 'A cozy winter get-together with CS2, Valorant and Jackbox in the late hours.',
		theme: 'Cozy PC Night',
		location: 'Makerspace',
		coverImage: '/lan-cover-2.jpg',
		startsAt: new Date(now + day * 7),
		endsAt: new Date(now + day * 7 + 1000 * 60 * 60 * 8),
		status: 'future',
		gameIds: ['game-cs2', 'game-valorant', 'game-trackmania', 'game-jackbox'],
		consoles: [
			{ consoleId: 'console-pc', count: 20 },
			{ consoleId: 'console-switch', count: 2 },
			{ consoleId: 'console-ps5', count: 1 }
		],
		attendeePlayerIds: ['u1', 'u3', 'u4', 'u8', 'u6']
	},
	{
		id: 'lan-005',
		title: 'Autumn FragFest',
		description: 'CS2, Valorant, Trackmania night. BYO rig and snacks.',
		theme: 'FPS + Racing',
		location: 'Community Hall',
		coverImage: '/lan-cover-2.jpg',
		startsAt: new Date(now + day * 14),
		endsAt: new Date(now + day * 14 + 1000 * 60 * 60 * 10),
		status: 'future',
		gameIds: ['game-cs2', 'game-valorant', 'game-rocket-league'],
		consoles: [
			{ consoleId: 'console-pc', count: 30 },
			{ consoleId: 'console-switch', count: 3 }
		],
		attendeePlayerIds: ['u1', 'u2', 'u4', 'u5']
	},
	{
		id: 'lan-004',
		title: 'Nintendo Couch Clash',
		description: 'A themed Nintendo party with Smash, Mario Kart and four-player chaos.',
		theme: 'Nintendo Party',
		location: 'Garage HQ',
		coverImage: '/lan-cover-2.jpg',
		startsAt: new Date(now - 1000 * 60 * 60 * 2),
		endsAt: new Date(now + 1000 * 60 * 60 * 4),
		status: 'ongoing',
		gameIds: ['game-smash', 'game-mario-kart', 'game-mario-party'],
		consoles: [
			{ consoleId: 'console-switch', count: 3 },
			{ consoleId: 'console-gamecube', count: 1 }
		],
		attendeePlayerIds: ['u2', 'u12', 'u5', 'u6']
	},
	{
		id: 'lan-003',
		title: 'Spring Bootcamp',
		description: 'Practice bracket + casual matches.',
		theme: 'Training Arc',
		location: 'LAN Lounge',
		coverImage: '/lan-cover-2.jpg',
		startsAt: new Date(now - day * 90),
		endsAt: new Date(now - day * 90 + 1000 * 60 * 60 * 9),
		status: 'expired',
		gameIds: ['game-cs2', 'game-apex', 'game-smash'],
		consoles: [
			{ consoleId: 'console-pc', count: 12 },
			{ consoleId: 'console-switch', count: 2 }
		],
		attendeePlayerIds: ['u1', 'u2', 'u3']
	}
];

type TournamentSeed = {
	id: string;
	lanId: string;
	gameId: string;
	name: string;
	winnerPlayerId: string | null;
	matches: {
		id: string;
		round: number;
		playerAId: string | null;
		playerBId: string | null;
		winnerPlayerId: string | null;
		score: string | null;
	}[];
};

const tournaments: TournamentSeed[] = [
	{
		id: 't1',
		lanId: 'lan-006',
		gameId: 'game-cs2',
		name: 'CS2 5v5 Bracket',
		winnerPlayerId: 'u1',
		matches: [
			{ id: 'm1', round: 1, playerAId: 'u1', playerBId: 'u3', winnerPlayerId: 'u1', score: '13:9' },
			{
				id: 'm2',
				round: 1,
				playerAId: 'u4',
				playerBId: 'u8',
				winnerPlayerId: 'u4',
				score: '13:11'
			},
			{ id: 'm3', round: 2, playerAId: 'u1', playerBId: 'u4', winnerPlayerId: 'u1', score: '16:14' }
		]
	},
	{
		id: 't2',
		lanId: 'lan-006',
		gameId: 'game-trackmania',
		name: 'Trackmania Time Attack',
		winnerPlayerId: 'u10',
		matches: []
	},
	{
		id: 't3',
		lanId: 'lan-004',
		gameId: 'game-smash',
		name: 'Smash Singles',
		winnerPlayerId: 'u2',
		matches: [
			{ id: 'm4', round: 1, playerAId: 'u2', playerBId: 'u5', winnerPlayerId: 'u2', score: '2:0' },
			{
				id: 'm5',
				round: 1,
				playerAId: 'u12',
				playerBId: 'u6',
				winnerPlayerId: 'u12',
				score: '2:1'
			},
			{
				id: 'm6',
				round: 2,
				playerAId: 'u2',
				playerBId: 'u12',
				winnerPlayerId: 'u2',
				score: '3:2'
			}
		]
	},
	{
		id: 't4',
		lanId: 'lan-005',
		gameId: 'game-valorant',
		name: 'Valorant 5v5',
		winnerPlayerId: 'u1',
		matches: [
			{ id: 'm7', round: 1, playerAId: 'u1', playerBId: 'u3', winnerPlayerId: 'u1', score: '13:9' },
			{
				id: 'm8',
				round: 1,
				playerAId: 'u4',
				playerBId: 'u8',
				winnerPlayerId: 'u4',
				score: '13:11'
			},
			{ id: 'm9', round: 2, playerAId: 'u1', playerBId: 'u4', winnerPlayerId: 'u1', score: '16:14' }
		]
	},
	{
		id: 't5',
		lanId: 'lan-003',
		gameId: 'game-smash',
		name: 'Smash Singles (Bootcamp)',
		winnerPlayerId: 'u2',
		matches: []
	}
];

async function seed() {
	console.log('Clearing existing data...');
	await db.delete(table.tournamentMatch);
	await db.delete(table.tournament);
	await db.delete(table.playerAchievement);
	await db.delete(table.playerTitle);
	await db.delete(table.achievement);
	await db.delete(table.title);
	await db.delete(table.playerGame);
	await db.delete(table.playerGear);
	await db.delete(table.lanConsole);
	await db.delete(table.lanGame);
	await db.delete(table.lanAttendance);
	await db.delete(table.lanParty);
	await db.delete(table.consoleDevice);
	await db.delete(table.game);
	await db.delete(table.playerProfile);
	await db.delete(table.session);
	await db.delete(table.oauthAccount);
	await db.delete(table.user);
	await db.delete(table.tenant);

	console.log('Seeding tenant...');
	await db.insert(table.tenant).values({
		id: DEFAULT_TENANT_ID,
		name: DEFAULT_TENANT_NAME,
		slug: DEFAULT_TENANT_SLUG,
		createdAt: new Date()
	});

	console.log('Seeding catalog (games, consoles, titles, achievements)...');
	await db.insert(table.game).values(
		games.map((g) => ({
			id: g.id,
			tenantId: DEFAULT_TENANT_ID,
			name: g.name,
			platform: g.platform
		}))
	);
	await db
		.insert(table.consoleDevice)
		.values(consoles.map((c) => ({ id: c.id, tenantId: DEFAULT_TENANT_ID, name: c.name })));
	await db
		.insert(table.title)
		.values(
			titles.map((t) => ({ id: t.id, tenantId: DEFAULT_TENANT_ID, name: t.name, source: null }))
		);
	await db
		.insert(table.achievement)
		.values(achievements.map((a) => ({ ...a, tenantId: DEFAULT_TENANT_ID })));

	console.log('Seeding players...');
	// player_profile.xp is stored but no longer read directly — the query layer
	// (getPlayers) computes real xp from lan_attendance.xpAwarded + earned
	// achievement xp instead, so it can't drift from actual history. These
	// seed values are just placeholders for the column, not what the UI shows.
	await db.insert(table.playerProfile).values(
		players.map((p) => ({
			id: p.id,
			tenantId: DEFAULT_TENANT_ID,
			userId: null,
			username: p.username,
			avatarUrl: p.avatarUrl,
			activeTitle: p.title,
			rarity: p.rarity,
			xp: p.xp,
			longestStreak: p.longestStreak
		}))
	);

	console.log('Seeding player gear, titles, achievements, and game libraries...');
	for (const p of players) {
		if (p.gear.length > 0) {
			await db
				.insert(table.playerGear)
				.values(p.gear.map((g) => ({ playerId: p.id, consoleId: g.consoleId, count: g.count })));
		}
		await db.insert(table.playerTitle).values([
			{ playerId: p.id, titleId: titleId(p.title), earnedAt: new Date(now - day * 30) },
			{ playerId: p.id, titleId: titleId('Fresh Spawn'), earnedAt: new Date(now - day * 120) }
		]);
		await db.insert(table.playerAchievement).values(
			achievements.slice(0, p.achievementCount).map((a) => ({
				playerId: p.id,
				achievementId: a.id,
				earnedAt: new Date(now - day * 60)
			}))
		);
	}

	console.log('Seeding LAN parties, attendance, games, and consoles...');
	for (const lan of lans) {
		await db.insert(table.lanParty).values({
			id: lan.id,
			tenantId: DEFAULT_TENANT_ID,
			title: lan.title,
			description: lan.description,
			theme: lan.theme,
			location: lan.location,
			coverImage: lan.coverImage,
			startsAt: lan.startsAt,
			endsAt: lan.endsAt,
			status: lan.status
		});

		await db.insert(table.lanGame).values(lan.gameIds.map((gameId) => ({ lanId: lan.id, gameId })));

		await db
			.insert(table.lanConsole)
			.values(lan.consoles.map((c) => ({ lanId: lan.id, consoleId: c.consoleId, count: c.count })));

		await db.insert(table.lanAttendance).values(
			lan.attendeePlayerIds.map((playerId) => ({
				lanId: lan.id,
				playerId,
				joinedAt: new Date(lan.startsAt.getTime() - 1000 * 60 * 30),
				checkedIn: lan.status !== 'future',
				xpAwarded: lan.status === 'expired' || lan.status === 'ongoing' ? 100 : 0
			}))
		);

		// Seed a believable personal game library: each attendee "owns" a couple of
		// the LAN's games, so the ownership feature has real cross-referenceable
		// data from day one (see docs/data-model.md).
		for (const playerId of lan.attendeePlayerIds) {
			for (const gameId of lan.gameIds.slice(0, 2)) {
				await db
					.insert(table.playerGame)
					.values({ playerId, gameId, platform: null, notes: null })
					.onConflictDoNothing();
			}
		}
	}

	console.log('Seeding tournaments and matches...');
	for (const t of tournaments) {
		await db.insert(table.tournament).values({
			id: t.id,
			tenantId: DEFAULT_TENANT_ID,
			lanId: t.lanId,
			gameId: t.gameId,
			name: t.name,
			startsAt: null,
			winnerPlayerId: t.winnerPlayerId
		});
		if (t.matches.length > 0) {
			await db.insert(table.tournamentMatch).values(
				t.matches.map((m) => ({
					id: m.id,
					tournamentId: t.id,
					round: m.round,
					playerAId: m.playerAId,
					playerBId: m.playerBId,
					winnerPlayerId: m.winnerPlayerId,
					score: m.score
				}))
			);
		}
	}

	console.log('Seed complete.');
}

seed()
	.then(() => client.end())
	.then(() => process.exit(0))
	.catch((err) => {
		console.error(err);
		return client.end().finally(() => process.exit(1));
	});
