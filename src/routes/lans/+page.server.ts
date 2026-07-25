import { getLanOverviews } from '$lib/server/db/queries';

export const load = async () => {
	return {
		lans: await getLanOverviews()
	};
};
