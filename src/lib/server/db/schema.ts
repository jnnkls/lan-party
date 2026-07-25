import {
	pgTable,
	pgEnum,
	integer,
	varchar,
	timestamp,
	text,
	primaryKey,
	boolean,
	unique
} from 'drizzle-orm/pg-core';

export const rarityEnum = pgEnum('rarity', ['common', 'rare', 'epic', 'legendary']);
export const lanStatusEnum = pgEnum('lan_status', ['expired', 'ongoing', 'future']);

export const tenant = pgTable('tenant', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 120 }).notNull(),
	slug: varchar('slug', { length: 80 }).notNull().unique(),
	createdAt: timestamp('created_at').notNull()
});

export const user = pgTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 }).references(() => tenant.id),
	age: integer('age'),
	username: varchar('username', { length: 32 }).notNull().unique(),
	// Nullable: users who only ever sign in via an OIDC/OAuth provider have no password.
	passwordHash: varchar('password_hash', { length: 255 })
});

export const session = pgTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp('expires_at').notNull()
});

export const oauthAccount = pgTable(
	'oauth_account',
	{
		id: varchar('id', { length: 255 }).primaryKey(),
		userId: varchar('user_id', { length: 255 })
			.notNull()
			.references(() => user.id),
		provider: varchar('provider', { length: 60 }).notNull(),
		providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
		createdAt: timestamp('created_at').notNull()
	},
	(table) => [unique().on(table.provider, table.providerAccountId)]
);

export const playerProfile = pgTable('player_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	userId: varchar('user_id', { length: 255 }).references(() => user.id),
	username: varchar('username', { length: 32 }).notNull(),
	avatarUrl: varchar('avatar_url', { length: 512 }),
	activeTitle: varchar('active_title', { length: 120 }),
	rarity: rarityEnum('rarity').notNull().default('common'),
	xp: integer('xp').notNull().default(0),
	longestStreak: integer('longest_streak').notNull().default(0)
});

export const lanParty = pgTable('lan_party', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	title: varchar('title', { length: 160 }).notNull(),
	description: text('description'),
	theme: varchar('theme', { length: 120 }),
	location: varchar('location', { length: 160 }),
	coverImage: varchar('cover_image', { length: 512 }),
	startsAt: timestamp('starts_at').notNull(),
	endsAt: timestamp('ends_at'),
	status: lanStatusEnum('status').notNull().default('future')
});

export const lanAttendance = pgTable(
	'lan_attendance',
	{
		lanId: varchar('lan_id', { length: 255 })
			.notNull()
			.references(() => lanParty.id),
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		joinedAt: timestamp('joined_at').notNull(),
		checkedIn: boolean('checked_in').notNull().default(false),
		xpAwarded: integer('xp_awarded').notNull().default(0)
	},
	(table) => [primaryKey({ columns: [table.lanId, table.playerId] })]
);

export const game = pgTable('game', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 160 }).notNull(),
	platform: varchar('platform', { length: 120 })
});

export const lanGame = pgTable(
	'lan_game',
	{
		lanId: varchar('lan_id', { length: 255 })
			.notNull()
			.references(() => lanParty.id),
		gameId: varchar('game_id', { length: 255 })
			.notNull()
			.references(() => game.id)
	},
	(table) => [primaryKey({ columns: [table.lanId, table.gameId] })]
);

export const consoleDevice = pgTable('console', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 160 }).notNull()
});

export const lanConsole = pgTable(
	'lan_console',
	{
		lanId: varchar('lan_id', { length: 255 })
			.notNull()
			.references(() => lanParty.id),
		consoleId: varchar('console_id', { length: 255 })
			.notNull()
			.references(() => consoleDevice.id),
		count: integer('count').notNull().default(1)
	},
	(table) => [primaryKey({ columns: [table.lanId, table.consoleId] })]
);

export const playerGear = pgTable(
	'player_gear',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		consoleId: varchar('console_id', { length: 255 })
			.notNull()
			.references(() => consoleDevice.id),
		count: integer('count').notNull().default(1)
	},
	(table) => [primaryKey({ columns: [table.playerId, table.consoleId] })]
);

export const playerGame = pgTable(
	'player_game',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		gameId: varchar('game_id', { length: 255 })
			.notNull()
			.references(() => game.id),
		platform: varchar('platform', { length: 120 }),
		notes: varchar('notes', { length: 255 })
	},
	(table) => [primaryKey({ columns: [table.playerId, table.gameId] })]
);

export const tournament = pgTable('tournament', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	lanId: varchar('lan_id', { length: 255 })
		.notNull()
		.references(() => lanParty.id),
	gameId: varchar('game_id', { length: 255 })
		.notNull()
		.references(() => game.id),
	name: varchar('name', { length: 160 }).notNull(),
	startsAt: timestamp('starts_at'),
	winnerPlayerId: varchar('winner_player_id', { length: 255 }).references(() => playerProfile.id)
});

export const tournamentMatch = pgTable('tournament_match', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tournamentId: varchar('tournament_id', { length: 255 })
		.notNull()
		.references(() => tournament.id),
	round: integer('round').notNull(),
	playerAId: varchar('player_a_id', { length: 255 }).references(() => playerProfile.id),
	playerBId: varchar('player_b_id', { length: 255 }).references(() => playerProfile.id),
	winnerPlayerId: varchar('winner_player_id', { length: 255 }).references(() => playerProfile.id),
	score: varchar('score', { length: 40 })
});

export const title = pgTable('title', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 120 }).notNull(),
	source: varchar('source', { length: 160 })
});

export const playerTitle = pgTable(
	'player_title',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		titleId: varchar('title_id', { length: 255 })
			.notNull()
			.references(() => title.id),
		earnedAt: timestamp('earned_at').notNull()
	},
	(table) => [primaryKey({ columns: [table.playerId, table.titleId] })]
);

export const achievement = pgTable('achievement', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 120 }).notNull(),
	description: text('description').notNull(),
	xp: integer('xp').notNull().default(0),
	titleRewardId: varchar('title_reward_id', { length: 255 }).references(() => title.id)
});

export const playerAchievement = pgTable(
	'player_achievement',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		achievementId: varchar('achievement_id', { length: 255 })
			.notNull()
			.references(() => achievement.id),
		earnedAt: timestamp('earned_at').notNull()
	},
	(table) => [primaryKey({ columns: [table.playerId, table.achievementId] })]
);

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Tenant = typeof tenant.$inferSelect;
export type OauthAccount = typeof oauthAccount.$inferSelect;
export type PlayerProfile = typeof playerProfile.$inferSelect;
export type LanParty = typeof lanParty.$inferSelect;
export type Game = typeof game.$inferSelect;
export type PlayerGame = typeof playerGame.$inferSelect;
