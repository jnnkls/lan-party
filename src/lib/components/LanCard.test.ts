import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import LanCard from './LanCard.svelte';
import type { LanOverview } from '$lib/types';

const baseLan: LanOverview = {
	id: 'lan-1',
	title: 'Winter LAN Bash',
	date: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
	location: 'Makerspace',
	status: 'future',
	games: ['Counter-Strike 2'],
	attendees: 12
};

describe('LanCard', () => {
	it('renders the LAN title and an upcoming status', () => {
		render(LanCard, { props: { lan: baseLan } });

		expect(screen.getByText('Winter LAN Bash')).toBeInTheDocument();
		expect(screen.getByText('Upcoming')).toBeInTheDocument();
	});

	it('renders an "Archived" status for expired LANs', () => {
		render(LanCard, {
			props: { lan: { ...baseLan, status: 'expired', date: new Date(0).toISOString() } }
		});

		expect(screen.getByText('Archived')).toBeInTheDocument();
	});

	it('omits the clickable overlay link when clickable is false', () => {
		const { container } = render(LanCard, { props: { lan: baseLan, clickable: false } });

		expect(container.querySelector('a[aria-label="Open Winter LAN Bash"]')).toBeNull();
	});
});
