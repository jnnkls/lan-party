import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import { verifyPassword } from '$lib/server/password';
import { loginSchema } from '$lib/server/validation';
import { checkRateLimit } from '$lib/server/rate-limit';
import { githubEnabled } from '$lib/server/oauth/github';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/home');
	return { githubEnabled };
};

export const actions: Actions = {
	default: async (event) => {
		const rateLimit = checkRateLimit(`login:${event.getClientAddress()}`, 10, 15 * 60 * 1000);
		if (!rateLimit.allowed) {
			return fail(429, {
				message: 'Too many attempts. Please try again in a few minutes.',
				username: ''
			});
		}

		const formData = await event.request.formData();
		const rawUsername = formData.get('username');
		const parsed = loginSchema.safeParse({
			username: rawUsername,
			password: formData.get('password')
		});
		if (!parsed.success) {
			return fail(400, {
				message: 'Enter a username and password',
				username: typeof rawUsername === 'string' ? rawUsername : ''
			});
		}
		const { username, password } = parsed.data;

		const [existingUser] = await db
			.select()
			.from(table.user)
			.where(eq(table.user.username, username));
		if (!existingUser || !existingUser.passwordHash) {
			return fail(400, { message: 'Incorrect username or password', username });
		}

		const validPassword = await verifyPassword(existingUser.passwordHash, password);
		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password', username });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(302, '/home');
	}
};
