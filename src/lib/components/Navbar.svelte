<div class="nav-container">
	<div class="logo">
		<div class="red"></div>
	</div>

	<nav>
		<a href="/home">Home</a>
		<a href="/leaderboard">Leaderboard</a>
		<a href="/lans">LANs</a>
		<a href="/players">Players</a>
		<a href="/wheel">Wheel</a>
	</nav>

	<div class="pfp">
		<div class="red"></div>
	</div>
</div>

<style>
	.nav-container {
		width: 100%;
		display: flex;

		justify-content: space-between;
		align-items: center;

		--height: 3rem;
	}

	nav {
		display: flex;
		flex-direction: row;
		gap: 1em;

		width: fit-content;
		height: var(--height);

		background-color: whitesmoke;
		padding: 1em;
		margin: 1em;
		border-radius: 2em;

		justify-content: space-between;
		align-items: center;
	}

	nav > a {
		font-size: large;
	}

	.red {
		background-color: red;
		border-radius: 100%;

		height: var(--height);
		width: var(--height);

		margin: 1em;
	}
</style>
