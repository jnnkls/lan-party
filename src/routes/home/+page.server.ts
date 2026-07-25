import { getHomeEvents } from '$lib/server/db/queries';

export const load = async () => {
	return {
		events: await getHomeEvents()
	};
};
