import { error, redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';
import { dev } from '$app/environment';
import { github, githubEnabled } from '$lib/server/oauth/github';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	if (!githubEnabled || !github) {
		error(404, 'GitHub login is not configured');
	}

	const state = generateState();
	const url = github.createAuthorizationURL(state, ['read:user']);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		httpOnly: true,
		secure: !dev,
		sameSite: 'lax',
		maxAge: 60 * 10
	});

	redirect(302, url.toString());
};
