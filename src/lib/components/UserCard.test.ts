import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import UserCard from './UserCard.svelte';

describe('UserCard', () => {
	it('renders the username, rank, and default title', () => {
		render(UserCard, { props: { id: 'p1', username: 'FragMaster', rank: 1 } });

		expect(screen.getByText('FragMaster')).toBeInTheDocument();
		expect(screen.getByText('#1')).toBeInTheDocument();
		expect(screen.getByText('LAN Rookie')).toBeInTheDocument();
	});

	it('derives level from xp', () => {
		render(UserCard, { props: { id: 'p1', username: 'FragMaster', rank: 1, xp: 500 } });

		// level = floor(500 / 250) + 1 = 3
		expect(screen.getByText('3')).toBeInTheDocument();
	});
});
