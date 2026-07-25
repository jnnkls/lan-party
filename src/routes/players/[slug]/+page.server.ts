import { error } from '@sveltejs/kit';
import { getPlayerDetail } from '$lib/server/mock-data';

export const load = ({ params }) => {
	const player = getPlayerDetail(params.slug);
	if (!player) throw error(404, 'Player not found');
	return { player };
};
