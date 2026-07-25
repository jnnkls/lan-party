import { getHomeEvents } from '$lib/server/mock-data';

export const load = () => {
	return {
		events: getHomeEvents()
	};
};
