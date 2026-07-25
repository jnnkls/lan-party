<button
	class="theme-toggle"
	data-theme-toggle
	type="button"
	aria-label="Switch theme"
	title="Switch theme"
>
	<i class="fa-solid fa-moon moon-icon"></i>
	<i class="fa-solid fa-sun sun-icon"></i>
</button>

<style>
	.theme-toggle {
		position: fixed;
		right: 1rem;
		bottom: 1rem;
		z-index: 50;
		display: inline-flex;
		height: 3rem;
		width: 3rem;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
		border: 1px solid var(--border-strong);
		background: var(--surface-raised);
		color: var(--text);
		box-shadow: var(--shadow);
		backdrop-filter: blur(10px);
	}

	.theme-toggle:hover {
		border-color: var(--accent);
		background: var(--surface-hover);
	}

	.sun-icon {
		display: none;
	}

	:global(.dark) .moon-icon {
		display: none;
	}

	:global(.dark) .sun-icon {
		display: inline-block;
	}
</style>
