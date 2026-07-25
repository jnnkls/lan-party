import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		// SvelteKit auto-generates a nonce per request for its own inline styles/
		// scripts and for the theme-bootstrap script in app.html (via
		// %sveltekit.nonce%) — see docs/security.md.
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ['self'],
				'script-src': ['self', 'https://kit.fontawesome.com'],
				// unsafe-inline is required for style-src: several components set
				// dynamic inline `style="..."` attributes (xp bars, rarity gradients),
				// and CSP has no nonce mechanism for style attributes (only <style>
				// elements) — SvelteKit's own docs call this out as a necessary
				// trade-off. script-src stays nonce-based and strict.
				'style-src': [
					'self',
					'unsafe-inline',
					'https://fonts.googleapis.com',
					'https://ka-f.fontawesome.com'
				],
				'font-src': ['self', 'https://fonts.gstatic.com', 'https://ka-f.fontawesome.com'],
				'img-src': ['self', 'data:', 'https:'],
				'connect-src': ['self', 'https://ka-f.fontawesome.com'],
				'frame-ancestors': ['none']
			}
		}
	}
};

export default config;
