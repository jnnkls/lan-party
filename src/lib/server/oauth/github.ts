import { GitHub } from 'arctic';
import { and, eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { DEFAULT_TENANT_ID } from '$lib/server/tenant';

export const PROVIDER = 'github';

export const githubEnabled = Boolean(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET);

export const github = githubEnabled
	? new GitHub(env.GITHUB_CLIENT_ID!, env.GITHUB_CLIENT_SECRET!, env.GITHUB_REDIRECT_URI ?? null)
	: null;

export type GithubProfile = {
	id: number;
	login: string;
	avatar_url?: string;
};

/**
 * Finds the user linked to this GitHub account, or creates a new user +
 * player profile + oauth_account link. Returns the resulting user id.
 *
 * Kept separate from the actual HTTP/redirect flow (see
 * src/routes/login/github/) so the account-linking logic can be tested
 * against a real database without needing live GitHub credentials.
 */
export async function upsertGithubUser(profile: GithubProfile): Promise<string> {
	const providerAccountId = String(profile.id);

	const [existingLink] = await db
		.select({ userId: table.oauthAccount.userId })
		.from(table.oauthAccount)
		.where(
			and(
				eq(table.oauthAccount.provider, PROVIDER),
				eq(table.oauthAccount.providerAccountId, providerAccountId)
			)
		);

	if (existingLink) {
		return existingLink.userId;
	}

	const userId = auth.generateUserId();
	const playerId = auth.generateUserId();

	await db.transaction(async (tx) => {
		// `user.username` is unique; a GitHub login could already be taken by a
		// password-registered account, so fall back to a suffixed variant.
		const [usernameTaken] = await tx
			.select({ id: table.user.id })
			.from(table.user)
			.where(eq(table.user.username, profile.login));
		const username = usernameTaken
			? `${profile.login}-${Math.random().toString(36).slice(2, 6)}`
			: profile.login;

		await tx.insert(table.user).values({
			id: userId,
			tenantId: DEFAULT_TENANT_ID,
			username,
			passwordHash: null
		});
		await tx.insert(table.playerProfile).values({
			id: playerId,
			tenantId: DEFAULT_TENANT_ID,
			userId,
			username,
			avatarUrl: profile.avatar_url,
			rarity: 'common',
			xp: 0,
			longestStreak: 0
		});
		await tx.insert(table.oauthAccount).values({
			id: auth.generateUserId(),
			userId,
			provider: PROVIDER,
			providerAccountId,
			createdAt: new Date()
		});
	});

	return userId;
}
