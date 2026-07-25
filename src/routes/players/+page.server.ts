import { getPlayers } from '$lib/server/db/queries';

export const load = async () => {
	return {
		players: await getPlayers()
	};
};
