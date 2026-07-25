import type {
	Achievement,
	LanDetail,
	LanOverview,
	PlayerDetail,
	Rarity,
	TournamentOverview
} from '$lib/types';

const now = Date.now();

const achievements: Achievement[] = [
	{
		id: 'ach-first-login',
		name: 'Cable Connected',
		description: 'Joined the party manager for the first time.',
		xp: 50,
		titleReward: 'Fresh Spawn'
	},
	{
		id: 'ach-streak',
		name: 'Never Unplugged',
		description: 'Built a LAN attendance streak.',
		xp: 250,
		titleReward: 'LAN Loyalist'
	},
	{
		id: 'ach-winner',
		name: 'Bracket Breaker',
		description: 'Won a tournament bracket.',
		xp: 500,
		titleReward: 'Champion'
	}
];

const players: PlayerDetail[] = [
	player(
		'u1',
		'FragMaster',
		'https://i.pravatar.cc/100?img=68',
		'Tekken King',
		'legendary',
		1850,
		14,
		6,
		[
			{ name: 'PC', count: 1 },
			{ name: 'PS5', count: 1 },
			{ name: 'Nintendo Switch', count: 1 }
		]
	),
	player(
		'u2',
		'PixelQueen',
		'https://i.pravatar.cc/100?img=32',
		'Smash Diva',
		'epic',
		1630,
		12,
		4,
		[
			{ name: 'PC', count: 1 },
			{ name: 'Nintendo Switch', count: 1 }
		]
	),
	player('u3', 'NoScope', 'https://i.pravatar.cc/100?img=12', 'CS2 Ace', 'rare', 1210, 9, 3, [
		{ name: 'PC', count: 1 }
	]),
	player(
		'u4',
		'LANLegend',
		'https://i.pravatar.cc/100?img=23',
		'Valorant Shotcaller',
		'epic',
		1420,
		11,
		2,
		[
			{ name: 'PC', count: 1 },
			{ name: 'Steam Deck', count: 1 }
		]
	),
	player(
		'u5',
		'SnackBringer',
		'https://i.pravatar.cc/100?img=5',
		'Logistics MVP',
		'common',
		1320,
		15,
		1,
		[
			{ name: 'Nintendo Switch', count: 2 },
			{ name: 'GameCube', count: 1 },
			{ name: 'PS5', count: 1 },
			{ name: 'PC', count: 1 }
		]
	),
	player('u6', 'CableGuy', 'https://i.pravatar.cc/100?img=7', 'Setup Wizard', 'rare', 980, 8, 2, [
		{ name: 'PC', count: 1 }
	]),
	player(
		'u7',
		'LagWizard',
		'https://i.pravatar.cc/100?img=14',
		'Ping Whisperer',
		'common',
		860,
		7,
		1,
		[
			{ name: 'PC', count: 1 },
			{ name: 'Nintendo Switch', count: 1 }
		]
	),
	player(
		'u8',
		'PatchNotes',
		'https://i.pravatar.cc/100?img=9',
		'Meta Analyst',
		'rare',
		1180,
		10,
		3,
		[
			{ name: 'PC', count: 1 },
			{ name: 'Steam Deck', count: 1 }
		]
	),
	player('u9', 'TeaBag', 'https://i.pravatar.cc/100?img=19', 'BM Enthusiast', 'epic', 1160, 6, 5, [
		{ name: 'PC', count: 1 }
	]),
	player('u10', 'VSync', 'https://i.pravatar.cc/100?img=44', 'Frame Lord', 'common', 640, 4, 1, [
		{ name: 'PC', count: 1 }
	]),
	player(
		'u11',
		'WarmupOnly',
		'https://i.pravatar.cc/100?img=16',
		'Aim Lab Champ',
		'rare',
		520,
		3,
		2,
		[{ name: 'PC', count: 1 }]
	),
	player(
		'u12',
		'Smurfette',
		'https://i.pravatar.cc/100?img=25',
		'Bracket Breaker',
		'epic',
		1260,
		9,
		4,
		[
			{ name: 'Nintendo Switch', count: 1 },
			{ name: 'PC', count: 1 }
		]
	),
	player(
		'u13',
		'CritSnack',
		'https://i.pravatar.cc/100?img=52',
		'Nacho Strategist',
		'common',
		740,
		5,
		2,
		[{ name: 'Nintendo Switch', count: 1 }]
	),
	player('u14', 'RocketDad', 'https://i.pravatar.cc/100?img=53', 'Boost Baron', 'rare', 930, 7, 3, [
		{ name: 'PC', count: 1 },
		{ name: 'Controller', count: 2 }
	]),
	player(
		'u15',
		'ComboKid',
		'https://i.pravatar.cc/100?img=54',
		'Frame Trapper',
		'epic',
		1110,
		8,
		4,
		[
			{ name: 'PS5', count: 1 },
			{ name: 'Fight Stick', count: 1 }
		]
	),
	player(
		'u16',
		'PacketLoss',
		'https://i.pravatar.cc/100?img=55',
		'Router Whisperer',
		'common',
		430,
		3,
		1,
		[{ name: 'PC', count: 1 }]
	),
	player(
		'u17',
		'KartBandit',
		'https://i.pravatar.cc/100?img=56',
		'Blue Shell Dealer',
		'rare',
		1010,
		6,
		3,
		[
			{ name: 'Nintendo Switch', count: 1 },
			{ name: 'Joy-Con Pair', count: 2 }
		]
	),
	player(
		'u18',
		'AimToast',
		'https://i.pravatar.cc/100?img=57',
		'Warmup Wizard',
		'common',
		610,
		4,
		2,
		[{ name: 'PC', count: 1 }]
	),
	player(
		'u19',
		'PixelPunch',
		'https://i.pravatar.cc/100?img=58',
		'Arcade Bruiser',
		'rare',
		890,
		6,
		2,
		[
			{ name: 'Fight Stick', count: 1 },
			{ name: 'Steam Deck', count: 1 }
		]
	),
	player(
		'u20',
		'LootLlama',
		'https://i.pravatar.cc/100?img=59',
		'Snack Dropper',
		'common',
		570,
		5,
		1,
		[{ name: 'Nintendo Switch', count: 1 }]
	),
	player(
		'u21',
		'ClutchByte',
		'https://i.pravatar.cc/100?img=60',
		'Overtime Hero',
		'epic',
		1370,
		9,
		5,
		[
			{ name: 'PC', count: 1 },
			{ name: 'PS5', count: 1 }
		]
	),
	player(
		'u22',
		'SavePoint',
		'https://i.pravatar.cc/100?img=61',
		'Bracket Archivist',
		'rare',
		780,
		6,
		2,
		[
			{ name: 'Laptop', count: 1 },
			{ name: 'Capture Card', count: 1 }
		]
	)
];

const tournaments: TournamentOverview[] = [
	{
		id: 't1',
		name: 'CS2 5v5 Bracket',
		game: 'Counter-Strike 2',
		time: '18:00',
		winner: 'FragMaster',
		matches: [
			{
				id: 'm1',
				round: 1,
				playerA: 'FragMaster',
				playerB: 'NoScope',
				winner: 'FragMaster',
				score: '13:9'
			},
			{
				id: 'm2',
				round: 1,
				playerA: 'LANLegend',
				playerB: 'PatchNotes',
				winner: 'LANLegend',
				score: '13:11'
			},
			{
				id: 'm3',
				round: 2,
				playerA: 'FragMaster',
				playerB: 'LANLegend',
				winner: 'FragMaster',
				score: '16:14'
			}
		]
	},
	{
		id: 't2',
		name: 'Trackmania Time Attack',
		game: 'Trackmania',
		time: '21:00',
		winner: 'VSync',
		matches: []
	},
	{
		id: 't3',
		name: 'Smash Singles',
		game: 'Smash Ultimate',
		time: '20:00',
		winner: 'PixelQueen',
		matches: [
			{
				id: 'm4',
				round: 1,
				playerA: 'PixelQueen',
				playerB: 'SnackBringer',
				winner: 'PixelQueen',
				score: '2:0'
			},
			{
				id: 'm5',
				round: 1,
				playerA: 'Smurfette',
				playerB: 'CableGuy',
				winner: 'Smurfette',
				score: '2:1'
			},
			{
				id: 'm6',
				round: 2,
				playerA: 'PixelQueen',
				playerB: 'Smurfette',
				winner: 'PixelQueen',
				score: '3:2'
			}
		]
	}
];

const lans: LanDetail[] = [
	{
		id: 'lan-006',
		title: 'Winter LAN Bash',
		date: new Date(now + 1000 * 60 * 60 * 24 * 7).toISOString(),
		location: 'Makerspace',
		description: 'A cozy winter get-together with CS2, Valorant and Jackbox in the late hours.',
		coverImage: '/lan-cover-2.jpg',
		attendees: 18,
		attendeeNames: ['FragMaster', 'NoScope', 'LANLegend', 'PatchNotes', 'CableGuy'],
		status: 'future',
		theme: 'Cozy PC Night',
		games: ['Counter-Strike 2', 'Valorant', 'Trackmania', 'Jackbox Party Pack'],
		tournaments: [tournaments[0], tournaments[1]],
		consoles: [
			{ name: 'PC Setups', count: 20 },
			{ name: 'Nintendo Switch', count: 2 },
			{ name: 'PS5', count: 1 }
		]
	},
	{
		id: 'lan-005',
		title: 'Autumn FragFest',
		date: new Date(now + 1000 * 60 * 60 * 24 * 14).toISOString(),
		location: 'Community Hall',
		description: 'CS2, Valorant, Trackmania night. BYO rig and snacks.',
		coverImage: '/lan-cover-2.jpg',
		attendees: 24,
		attendeeNames: ['FragMaster', 'PixelQueen', 'LANLegend', 'SnackBringer'],
		status: 'future',
		theme: 'FPS + Racing',
		games: ['Counter-Strike 2', 'Valorant', 'Rocket League'],
		tournaments: [{ ...tournaments[0], id: 't4', name: 'Valorant 5v5', game: 'Valorant' }],
		consoles: [
			{ name: 'PC Setups', count: 30 },
			{ name: 'Switch Docks', count: 3 }
		]
	},
	{
		id: 'lan-004',
		title: 'Nintendo Couch Clash',
		date: new Date(now - 1000 * 60 * 60 * 2).toISOString(),
		location: 'Garage HQ',
		description: 'A themed Nintendo party with Smash, Mario Kart and four-player chaos.',
		coverImage: '/lan-cover-2.jpg',
		attendees: 12,
		attendeeNames: ['PixelQueen', 'Smurfette', 'SnackBringer', 'CableGuy'],
		status: 'ongoing',
		theme: 'Nintendo Party',
		games: ['Smash Ultimate', 'Mario Kart 8', 'Mario Party'],
		tournaments: [tournaments[2]],
		consoles: [
			{ name: 'Nintendo Switch', count: 3 },
			{ name: 'GameCube', count: 1 }
		]
	},
	{
		id: 'lan-003',
		title: 'Spring Bootcamp',
		date: new Date(now - 1000 * 60 * 60 * 24 * 90).toISOString(),
		location: 'LAN Lounge',
		description: 'Practice bracket + casual matches.',
		coverImage: '/lan-cover-2.jpg',
		attendees: 17,
		attendeeNames: ['FragMaster', 'PixelQueen', 'NoScope'],
		status: 'expired',
		theme: 'Training Arc',
		games: ['CS2', 'Apex Legends', 'Smash Ultimate'],
		tournaments: [{ ...tournaments[2], id: 't5' }],
		consoles: [
			{ name: 'PC Setups', count: 12 },
			{ name: 'Nintendo Switch', count: 2 }
		]
	}
];

function player(
	id: string,
	username: string,
	avatarUrl: string,
	title: string,
	rarity: Rarity,
	xp: number,
	attendanceCount: number,
	longestStreak: number,
	consoles: { name: string; count: number }[]
): PlayerDetail {
	return {
		id,
		username,
		avatarUrl,
		title,
		titles: [title, 'Fresh Spawn'],
		rarity,
		xp,
		attendanceCount,
		winStreak: Math.max(1, Math.min(longestStreak, 6)),
		longestStreak,
		consoleCount: consoles.reduce((sum, item) => sum + item.count, 0),
		consoles,
		achievements: achievements.slice(0, rarity === 'common' ? 1 : rarity === 'rare' ? 2 : 3)
	};
}

function overview(lan: LanDetail): LanOverview {
	return {
		id: lan.id,
		title: lan.title,
		date: lan.date,
		location: lan.location,
		description: lan.description,
		coverImage: lan.coverImage,
		attendees: lan.attendees,
		status: lan.status,
		theme: lan.theme,
		games: lan.games,
		consoleNames: lan.consoles.map((item) => item.name)
	};
}

export function getLanOverviews() {
	return lans.map(overview);
}

export function getHomeEvents() {
	return getLanOverviews();
}

export function getLanDetail(id: string) {
	return lans.find((lan) => lan.id === id) ?? null;
}

export function getPlayers() {
	return players
		.map((player) => ({
			...player,
			attendedLANs: getLanOverviews().filter((lan) => {
				const detail = getLanDetail(lan.id);
				return detail?.attendeeNames.includes(player.username);
			})
		}))
		.sort((a, b) => (b.xp ?? 0) - (a.xp ?? 0))
		.map((player, index) => ({ ...player, rank: index + 1 }));
}

export function getPlayerDetail(id: string) {
	const player = getPlayers().find((item) => item.id === id);
	if (!player) return null;
	return {
		...player,
		attendedLANs: getLanOverviews().filter((lan) => {
			const detail = getLanDetail(lan.id);
			return detail?.attendeeNames.includes(player.username);
		}),
		tournaments: tournaments
			.filter((tournament) =>
				tournament.matches?.some(
					(match) =>
						match.playerA === player.username ||
						match.playerB === player.username ||
						match.winner === player.username
				)
			)
			.map((tournament) => ({
				...tournament,
				placement: tournament.winner === player.username ? 1 : undefined
			}))
	};
}

export function getLeaderboard() {
	return getPlayers().map((player) => ({
		id: player.id,
		username: player.username,
		age: player.age ?? null,
		passwordHash: '',
		avatarUrl: player.avatarUrl,
		score: player.xp ?? 0
	}));
}
