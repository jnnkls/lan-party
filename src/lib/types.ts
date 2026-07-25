export type LanEvent = {
	id: string;
	title: string;
	date: string; // ISO format
	location?: string;
	description?: string;
	coverImage?: string;
};

export type LanOverview = LanEvent & {
	attendees?: number;
	status?: 'expired' | 'ongoing' | 'future';
	theme?: string;
	games?: string[];
	consoleNames?: string[];
};

export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

export type TournamentMatch = {
	id: string;
	round: number;
	playerA: string;
	playerB: string;
	winner?: string;
	score?: string;
};

export type TournamentOverview = {
	id: string;
	name: string;
	game: string;
	lanId?: string;
	time?: string;
	placement?: number;
	result?: string;
	winner?: string;
	matches?: TournamentMatch[];
};

export type GameCoverage = {
	name: string;
	ownedBy: string[];
};

export type LanDetail = LanOverview & {
	attendees: number;
	attendeeNames: string[];
	games: string[];
	tournaments: TournamentOverview[];
	consoles: { name: string; count: number }[];
	gameCoverage: GameCoverage[];
};

export type GearItem = {
	name: string;
	count: number;
};

export type OwnedGame = {
	name: string;
	platform?: string;
};

export type Achievement = {
	id: string;
	name: string;
	description: string;
	xp: number;
	titleReward?: string;
};

export type PlayerDetail = {
	id: string;
	username: string;
	age?: number;
	avatarUrl?: string;
	title?: string;
	titles?: string[];
	rarity?: Rarity;
	xp?: number;
	achievements?: Achievement[];
	attendanceCount?: number;
	winStreak?: number;
	longestStreak?: number;
	consoleCount?: number;
	rank?: number;
	consoles?: GearItem[];
	games?: OwnedGame[];
	attendedLANs?: LanOverview[];
	tournaments?: TournamentOverview[];
};

export type LeaderboardEntry = {
	id: string;
	username: string;
	avatarUrl?: string;
	score: number;
};
