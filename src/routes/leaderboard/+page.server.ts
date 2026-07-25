import { getLeaderboard } from '$lib/server/db/queries';

export const load = async () => {
	return {
		users: await getLeaderboard()
	};
};
