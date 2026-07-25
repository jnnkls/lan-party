import { afterAll, describe, expect, it } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { upsertGithubUser } from './github';

// Integration test against a real PostgreSQL instance — see docs/testing.md.
// Exercises the account-linking logic directly (given an already-fetched
// GitHub profile) rather than the HTTP redirect/token-exchange flow, since
// that needs live GitHub credentials this environment doesn't have.

const createdUserIds: string[] = [];

afterAll(async () => {
	for (const userId of createdUserIds) {
		await db.delete(table.oauthAccount).where(eq(table.oauthAccount.userId, userId));
		await db.delete(table.playerProfile).where(eq(table.playerProfile.userId, userId));
		await db.delete(table.user).where(eq(table.user.id, userId));
	}
});

describe('upsertGithubUser', () => {
	it('creates a new user, player profile, and oauth link on first login', async () => {
		const userId = await upsertGithubUser({
			id: 555001,
			login: 'octocat-test',
			avatar_url: 'https://example.com/avatar.png'
		});
		createdUserIds.push(userId);

		const [user] = await db.select().from(table.user).where(eq(table.user.id, userId));
		expect(user.passwordHash).toBeNull();

		const [player] = await db
			.select()
			.from(table.playerProfile)
			.where(eq(table.playerProfile.userId, userId));
		expect(player.username).toBe('octocat-test');
		expect(player.avatarUrl).toBe('https://example.com/avatar.png');

		const [link] = await db
			.select()
			.from(table.oauthAccount)
			.where(eq(table.oauthAccount.userId, userId));
		expect(link.provider).toBe('github');
		expect(link.providerAccountId).toBe('555001');
	});

	it('returns the same user id on a repeat login instead of creating a duplicate', async () => {
		const first = await upsertGithubUser({ id: 555002, login: 'repeat-login-test' });
		createdUserIds.push(first);
		const second = await upsertGithubUser({ id: 555002, login: 'repeat-login-test' });

		expect(second).toBe(first);

		const links = await db
			.select()
			.from(table.oauthAccount)
			.where(eq(table.oauthAccount.userId, first));
		expect(links).toHaveLength(1);
	});

	it('suffixes the username if the GitHub login is already taken', async () => {
		const takenUserId = await upsertGithubUser({ id: 555003, login: 'collision-test' });
		createdUserIds.push(takenUserId);

		const collidingUserId = await upsertGithubUser({ id: 555004, login: 'collision-test' });
		createdUserIds.push(collidingUserId);

		const [collidingUser] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.id, collidingUserId));
		expect(collidingUser.username).not.toBe('collision-test');
		expect(collidingUser.username.startsWith('collision-test-')).toBe(true);
	});
});
