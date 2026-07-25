import { error } from '@sveltejs/kit';
import { getLanDetail } from '$lib/server/db/queries';

export const load = async ({ params }) => {
	const lan = await getLanDetail(params.slug);
	if (!lan) error(404, 'LAN not found');
	return { lan };
};
