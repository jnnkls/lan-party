import {
	mysqlTable,
	int,
	varchar,
	datetime,
	text,
	mysqlEnum,
	primaryKey,
	boolean
} from 'drizzle-orm/mysql-core';

export const tenant = mysqlTable('tenant', {
	id: varchar('id', { length: 255 }).primaryKey(),
	name: varchar('name', { length: 120 }).notNull(),
	slug: varchar('slug', { length: 80 }).notNull().unique(),
	createdAt: datetime('created_at').notNull()
});

export const user = mysqlTable('user', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 }).references(() => tenant.id),
	age: int('age'),
	username: varchar('username', { length: 32 }).notNull().unique(),
	passwordHash: varchar('password_hash', { length: 255 }).notNull()
});

export const session = mysqlTable('session', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 255 })
		.notNull()
		.references(() => user.id),
	expiresAt: datetime('expires_at').notNull()
});

export const playerProfile = mysqlTable('player_profile', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	userId: varchar('user_id', { length: 255 }).references(() => user.id),
	username: varchar('username', { length: 32 }).notNull(),
	avatarUrl: varchar('avatar_url', { length: 512 }),
	activeTitle: varchar('active_title', { length: 120 }),
	rarity: mysqlEnum('rarity', ['common', 'rare', 'epic', 'legendary']).notNull().default('common'),
	xp: int('xp').notNull().default(0),
	longestStreak: int('longest_streak').notNull().default(0)
});

export const lanParty = mysqlTable('lan_party', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	title: varchar('title', { length: 160 }).notNull(),
	description: text('description'),
	theme: varchar('theme', { length: 120 }),
	location: varchar('location', { length: 160 }),
	coverImage: varchar('cover_image', { length: 512 }),
	startsAt: datetime('starts_at').notNull(),
	endsAt: datetime('ends_at'),
	status: mysqlEnum('status', ['expired', 'ongoing', 'future']).notNull().default('future')
});

export const lanAttendance = mysqlTable(
	'lan_attendance',
	{
		lanId: varchar('lan_id', { length: 255 })
			.notNull()
			.references(() => lanParty.id),
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		joinedAt: datetime('joined_at').notNull(),
		checkedIn: boolean('checked_in').notNull().default(false),
		xpAwarded: int('xp_awarded').notNull().default(0)
	},
	(table) => [primaryKey({ columns: [table.lanId, table.playerId] })]
);

export const game = mysqlTable('game', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 160 }).notNull(),
	platform: varchar('platform', { length: 120 })
});

export const lanGame = mysqlTable(
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

export const consoleDevice = mysqlTable('console', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 160 }).notNull()
});

export const lanConsole = mysqlTable(
	'lan_console',
	{
		lanId: varchar('lan_id', { length: 255 })
			.notNull()
			.references(() => lanParty.id),
		consoleId: varchar('console_id', { length: 255 })
			.notNull()
			.references(() => consoleDevice.id),
		count: int('count').notNull().default(1)
	},
	(table) => [primaryKey({ columns: [table.lanId, table.consoleId] })]
);

export const playerGear = mysqlTable(
	'player_gear',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		consoleId: varchar('console_id', { length: 255 })
			.notNull()
			.references(() => consoleDevice.id),
		count: int('count').notNull().default(1)
	},
	(table) => [primaryKey({ columns: [table.playerId, table.consoleId] })]
);

export const tournament = mysqlTable('tournament', {
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
	startsAt: datetime('starts_at'),
	winnerPlayerId: varchar('winner_player_id', { length: 255 }).references(() => playerProfile.id)
});

export const tournamentMatch = mysqlTable('tournament_match', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tournamentId: varchar('tournament_id', { length: 255 })
		.notNull()
		.references(() => tournament.id),
	round: int('round').notNull(),
	playerAId: varchar('player_a_id', { length: 255 }).references(() => playerProfile.id),
	playerBId: varchar('player_b_id', { length: 255 }).references(() => playerProfile.id),
	winnerPlayerId: varchar('winner_player_id', { length: 255 }).references(() => playerProfile.id),
	score: varchar('score', { length: 40 })
});

export const title = mysqlTable('title', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 120 }).notNull(),
	source: varchar('source', { length: 160 })
});

export const playerTitle = mysqlTable(
	'player_title',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		titleId: varchar('title_id', { length: 255 })
			.notNull()
			.references(() => title.id),
		earnedAt: datetime('earned_at').notNull()
	},
	(table) => [primaryKey({ columns: [table.playerId, table.titleId] })]
);

export const achievement = mysqlTable('achievement', {
	id: varchar('id', { length: 255 }).primaryKey(),
	tenantId: varchar('tenant_id', { length: 255 })
		.notNull()
		.references(() => tenant.id),
	name: varchar('name', { length: 120 }).notNull(),
	description: text('description').notNull(),
	xp: int('xp').notNull().default(0),
	titleRewardId: varchar('title_reward_id', { length: 255 }).references(() => title.id)
});

export const playerAchievement = mysqlTable(
	'player_achievement',
	{
		playerId: varchar('player_id', { length: 255 })
			.notNull()
			.references(() => playerProfile.id),
		achievementId: varchar('achievement_id', { length: 255 })
			.notNull()
			.references(() => achievement.id),
		earnedAt: datetime('earned_at').notNull()
	},
	(table) => [primaryKey({ columns: [table.playerId, table.achievementId] })]
);

export type Session = typeof session.$inferSelect;
export type User = typeof user.$inferSelect;
export type Tenant = typeof tenant.$inferSelect;
export type PlayerProfile = typeof playerProfile.$inferSelect;
export type LanParty = typeof lanParty.$inferSelect;
