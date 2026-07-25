import { error, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import {
	github,
	githubEnabled,
	upsertGithubUser,
	type GithubProfile
} from '$lib/server/oauth/github';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (!githubEnabled || !github) {
		error(404, 'GitHub login is not configured');
	}

	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;
	event.cookies.delete('github_oauth_state', { path: '/' });

	if (!code || !state || !storedState || state !== storedState) {
		error(400, 'Invalid OAuth state');
	}

	let accessToken: string;
	try {
		const tokens = await github.validateAuthorizationCode(code);
		accessToken = tokens.accessToken();
	} catch {
		error(400, 'Invalid authorization code');
	}

	const profileResponse = await fetch('https://api.github.com/user', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});
	if (!profileResponse.ok) {
		error(502, 'Failed to fetch GitHub profile');
	}
	const profile: GithubProfile = await profileResponse.json();

	const userId = await upsertGithubUser(profile);

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, userId);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

	redirect(302, '/home');
};
