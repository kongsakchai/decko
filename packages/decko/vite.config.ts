import adapter from '@sveltejs/adapter-auto'
import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from '@tailwindcss/vite'
import { playwright } from '@vitest/browser-playwright'

import path from 'node:path'
import { defineConfig } from 'vitest/config'

import { decko } from './src/lib/index.ts'

const testExclude = ['**/node_modules/**', '**/.svelte-kit/**', '**/dist/**', '**/coverage/**', '**/out/**']

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			extensions: ['.svelte', '.svelte.md'],
			preprocess: [decko()],
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
			},

			// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
			// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
			// See https://svelte.dev/docs/kit/adapters for more information about adapters.
			adapter: adapter()
		})
	],
	resolve: {
		alias: {
			'@deckomd/decko': path.resolve(import.meta.dirname, './src/lib')
		},
		conditions: process.env.VITEST ? ['browser'] : undefined
	},
	build: {
		outDir: 'out'
	},
	test: {
		expect: { requireAssertions: true },
		exclude: testExclude,
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts'],
			exclude: ['src/app.d.ts', '**/.svelte-kit/**', '**/dist/**', '**/coverage/**', '**/out/**'],
			reporter: ['text', 'text-summary', 'html'],
			thresholds: {
				perFile: true,
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80
			}
		},
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**', ...testExclude]
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', ...testExclude]
				}
			}
		]
	}
})
