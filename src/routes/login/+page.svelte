<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<section class="mt-4 flex justify-center">
	<div class="game-panel w-full max-w-md p-6">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-right-to-bracket"></i>
				<span>Welcome Back</span>
			</div>
			<h1 class="mb-4">Login</h1>

			<form method="POST" class="flex flex-col gap-4">
				<label class="flex flex-col gap-1">
					<span class="text-xs text-[var(--text-muted)] uppercase">Username</span>
					<input
						name="username"
						type="text"
						required
						value={form?.username ?? ''}
						autocomplete="username"
					/>
				</label>
				<label class="flex flex-col gap-1">
					<span class="text-xs text-[var(--text-muted)] uppercase">Password</span>
					<input name="password" type="password" required autocomplete="current-password" />
				</label>

				{#if form?.message}
					<p class="text-sm text-[var(--party-pink)]">{form.message}</p>
				{/if}

				<button type="submit" class="button !bg-[var(--accent)] !text-[var(--on-accent)]">
					<i class="fa-solid fa-right-to-bracket mr-2"></i>Log in
				</button>
			</form>

			{#if data.githubEnabled}
				<div class="party-divider my-5"></div>
				<a href="/login/github" class="button block text-center">
					<i class="fa-brands fa-github mr-2"></i>Continue with GitHub
				</a>
			{/if}

			<p class="mt-5 text-sm text-[var(--text-muted)]">
				New here? <a href="/register" class="text-[var(--accent)]">Create an account</a>
			</p>
		</div>
	</div>
</section>
