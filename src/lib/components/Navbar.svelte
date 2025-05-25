<script lang="ts">
	import logo from '/logo.png';
</script>

<div class="nav-container">
	<div class="nav-element">
		<img src={logo} alt="Logo" />
	</div>

	<nav>
		<a href="/home">Home</a>
		<a href="/leaderboard">Leaderboard</a>
		<a href="/lans">LANs</a>
		<a href="/players">Players</a>
		<a href="/wheel">Wheel</a>
	</nav>

	<div class="nav-element">
		<div class="pfp">
			<div class="pfp-head"></div>
			<div class="pfp-body"></div>
		</div>
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

	.pfp {
		background-color: whitesmoke;
		border-radius: 100%;

		width: 100%;
		height: 100%;

		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;

		gap: 0.125em;
	}

	.pfp > .pfp-head {
		background-color: white;
		border-radius: 100%;

		width: 1em;
		height: 1em;
	}

	.pfp > .pfp-body {
		background-color: white;
		border-radius: 100% 100% 0 0;

		width: 1.25em;
		height: 1.25em;
	}

	.nav-element {
		height: var(--height);
		width: var(--height);

		margin: 1em;
	}
</style>
