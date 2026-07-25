<script lang="ts">
	import { page } from '$app/state';
	import logo from '/logo.png';

	const links = [
		{ href: '/home', label: 'Campaign', icon: 'fa-house' },
		{ href: '/leaderboard', label: 'Leaderboard', icon: 'fa-ranking-star' },
		{ href: '/lans', label: 'LANs', icon: 'fa-ethernet' },
		{ href: '/players', label: 'Players', icon: 'fa-users' },
		{ href: '/wheel', label: 'Wheel', icon: 'fa-dice' }
	];

	const isActive = (href: string) =>
		page.url?.pathname === href || page.url?.pathname.startsWith(href + '/');
</script>

<header class="nav-container">
	<a href="/home" class="brand" aria-label="Home">
		<img src={logo} alt="Logo" />
	</a>

	<nav aria-label="Primary">
		{#each links as l (l.href)}
			<a href={l.href} class:active={isActive(l.href)}>
				<i class={`fa-solid ${l.icon}`}></i>
				<span>{l.label}</span>
			</a>
		{/each}
	</nav>

	<div class="party-status" aria-hidden="true">
		<i class="fa-solid fa-signal"></i>
		<span>Live</span>
	</div>
</header>

<style>
	.nav-container {
		position: sticky;
		top: 0;
		z-index: 40;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		padding: 0.85rem 1rem;
		background: color-mix(in srgb, var(--bg) 86%, transparent);
		border-bottom: 1px solid var(--border);
		backdrop-filter: blur(18px);

		--height: 3.35rem;
	}

	.brand {
		height: 3.35rem;
		width: 3.35rem;
		flex-shrink: 0;
		border: 1px solid var(--border-strong);
		border-radius: 4px;
		background:
			linear-gradient(135deg, var(--surface-raised), var(--accent) 64%), var(--surface-raised);
		padding: 0.25rem;
		box-shadow: none;
	}

	.brand img {
		height: 100%;
		width: 100%;
		object-fit: contain;
		filter: drop-shadow(0 3px 0 rgba(0, 0, 0, 0.22));
	}

	nav {
		display: flex;
		flex-direction: row;
		gap: 0.2rem;

		height: var(--height);
		padding: 0 0.35rem;

		background-color: transparent;
		backdrop-filter: blur(8px);
		border: 1px solid var(--border);
		border-radius: 4px;
		box-shadow: none;

		align-items: center;
		justify-content: center;
		flex-wrap: wrap;
		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	nav > a {
		font-family: 'Open Sans', system-ui, sans-serif;
		font-size: 0.74rem;
		font-weight: 800;
		color: var(--text-muted);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.65em 0.85em;
		border-radius: 3px;
		text-transform: uppercase;
		transition:
			color 0.15s,
			background-color 0.15s;
	}

	nav > a:hover {
		color: var(--text);
		background-color: var(--accent-soft);
	}

	nav > a.active {
		color: white;
		background: var(--accent);
		box-shadow: none;
	}

	.party-status {
		background-color: var(--accent);
		backdrop-filter: blur(8px);
		border: 1px solid var(--accent);
		border-radius: 4px;

		height: var(--height);
		min-width: 5rem;
		flex-shrink: 0;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		color: white;
		font-family: 'Open Sans', system-ui, sans-serif;
		font-size: 0.76rem;
		font-weight: 800;
		text-transform: uppercase;
		box-shadow: none;

		transition:
			background-color 0.2s,
			border-color 0.2s;
	}

	.nav-container,
	nav,
	.brand,
	.party-status {
		position: relative;
	}

	nav::before,
	.party-status::before {
		content: none;
		position: absolute;
		inset: 0.45rem;
		border-radius: 10px;
		border: 1px solid color-mix(in srgb, var(--accent) 26%, transparent);
		pointer-events: none;
	}

	@media (max-width: 640px) {
		.nav-container {
			align-items: flex-start;
			gap: 0.6rem;
			padding: 0.75rem;
			--height: auto;
		}

		.brand {
			height: 3rem;
			width: 3rem;
		}

		nav {
			height: auto;
			flex: 1;
		}

		nav {
			gap: 0.25rem;
			padding: 0.5rem;
		}

		nav > a {
			font-size: 0.68rem;
			padding: 0.45em 0.6em;
		}

		.party-status {
			display: none;
		}
	}
</style>
