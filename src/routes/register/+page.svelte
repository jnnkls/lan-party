<script lang="ts">
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
</script>

<section class="mt-4 flex justify-center">
	<div class="game-panel w-full max-w-md p-6">
		<div class="relative z-10">
			<div class="quest-tag mb-3">
				<i class="fa-solid fa-user-plus"></i>
				<span>New Player</span>
			</div>
			<h1 class="mb-4">Register</h1>

			<form method="POST" class="flex flex-col gap-4">
				<label class="flex flex-col gap-1">
					<span class="text-xs text-[var(--text-muted)] uppercase">Username</span>
					<input
						name="username"
						type="text"
						required
						minlength="3"
						maxlength="31"
						value={form?.username ?? ''}
						autocomplete="username"
					/>
				</label>
				<label class="flex flex-col gap-1">
					<span class="text-xs text-[var(--text-muted)] uppercase">Password</span>
					<input
						name="password"
						type="password"
						required
						minlength="8"
						autocomplete="new-password"
					/>
				</label>

				{#if form?.message}
					<p class="text-sm text-[var(--party-pink)]">{form.message}</p>
				{/if}

				<button type="submit" class="button !bg-[var(--accent)] !text-[var(--on-accent)]">
					<i class="fa-solid fa-user-plus mr-2"></i>Create account
				</button>
			</form>

			{#if data.githubEnabled}
				<div class="party-divider my-5"></div>
				<a href="/login/github" class="button block text-center">
					<i class="fa-brands fa-github mr-2"></i>Continue with GitHub
				</a>
			{/if}

			<p class="mt-5 text-sm text-[var(--text-muted)]">
				Already have an account? <a href="/login" class="text-[var(--accent-strong)] underline"
					>Log in</a
				>
			</p>
		</div>
	</div>
</section>
