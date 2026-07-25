import { getLanOverviews } from '$lib/server/mock-data';

export const load = () => {
	return {
		lans: getLanOverviews()
	};
};
