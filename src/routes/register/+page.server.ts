import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { DEFAULT_TENANT_ID } from '$lib/server/tenant';
import { hashPassword } from '$lib/server/password';
import { registerSchema } from '$lib/server/validation';
import { checkRateLimit } from '$lib/server/rate-limit';
import { githubEnabled } from '$lib/server/oauth/github';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/home');
	return { githubEnabled };
};

export const actions: Actions = {
	default: async (event) => {
		const rateLimit = checkRateLimit(`register:${event.getClientAddress()}`, 5, 15 * 60 * 1000);
		if (!rateLimit.allowed) {
			return fail(429, {
				message: 'Too many attempts. Please try again in a few minutes.',
				username: ''
			});
		}

		const formData = await event.request.formData();
		const rawUsername = formData.get('username');
		const parsed = registerSchema.safeParse({
			username: rawUsername,
			password: formData.get('password')
		});
		if (!parsed.success) {
			return fail(400, {
				message: parsed.error.issues[0]?.message ?? 'Invalid input',
				username: typeof rawUsername === 'string' ? rawUsername : ''
			});
		}
		const { username, password } = parsed.data;

		const [existing] = await db
			.select({ id: table.user.id })
			.from(table.user)
			.where(eq(table.user.username, username));
		if (existing) {
			return fail(400, { message: 'That username is already taken', username });
		}

		const passwordHash = await hashPassword(password);
		const userId = auth.generateUserId();
		const playerId = auth.generateUserId();

		await db.transaction(async (tx) => {
			await tx
				.insert(table.user)
				.values({ id: userId, tenantId: DEFAULT_TENANT_ID, username, passwordHash });
			await tx.insert(table.playerProfile).values({
				id: playerId,
				tenantId: DEFAULT_TENANT_ID,
				userId,
				username,
				rarity: 'common',
				xp: 0,
				longestStreak: 0
			});
		});

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, userId);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(302, '/home');
	}
};
