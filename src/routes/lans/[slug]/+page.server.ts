import { error } from '@sveltejs/kit';
import { getLanDetail } from '$lib/server/mock-data';

export const load = ({ params }) => {
	const lan = getLanDetail(params.slug);
	if (!lan) throw error(404, 'LAN not found');
	return { lan };
};
