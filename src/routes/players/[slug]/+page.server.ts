import { error } from '@sveltejs/kit';
import { getPlayerDetail } from '$lib/server/db/queries';

export const load = async ({ params }) => {
	const player = await getPlayerDetail(params.slug);
	if (!player) error(404, 'Player not found');
	return { player };
};
