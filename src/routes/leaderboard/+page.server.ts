import { getLeaderboard } from '$lib/server/mock-data';

export const load = () => {
	return {
		users: getLeaderboard()
	};
};
