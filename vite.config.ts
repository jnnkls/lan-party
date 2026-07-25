import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	test: {
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['tests/e2e/**'],
		// Integration test files share one real Postgres instance (no mocked DB)
		// and don't isolate their fixture data per file (e.g. the DEFAULT_TENANT_ID
		// row), so they must not run concurrently against it.
		fileParallelism: false
	}
});
