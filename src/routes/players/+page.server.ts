import { getPlayers } from '$lib/server/mock-data';

export const load = () => {
	return {
		players: getPlayers()
	};
};
