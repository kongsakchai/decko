import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { defineConfig } from 'vite'

import { decko } from './src/lib'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		svelte({
			extensions: ['.svelte', '.svelte.md'],
			preprocess: [decko(), vitePreprocess()]
		})
	]
})
