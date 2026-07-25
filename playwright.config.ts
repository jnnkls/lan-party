import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: [
		{
			command: 'pnpm build && pnpm preview',
			port: 4173,
			reuseExistingServer: !process.env.CI
		},
		{
			// Runs the actual dev server (not build+preview) so bugs that only
			// manifest under `vite dev` — e.g. static-asset imports resolved
			// differently than at build time — get caught. See dev-smoke.spec.ts.
			command: 'pnpm dev --port 5183',
			port: 5183,
			reuseExistingServer: !process.env.CI
		}
	],
	projects: [
		{
			name: 'build',
			testDir: 'tests/e2e',
			use: { baseURL: 'http://localhost:4173' }
		},
		{
			name: 'dev',
			testDir: 'tests/e2e-dev',
			use: { baseURL: 'http://localhost:5183' }
		}
	]
});
