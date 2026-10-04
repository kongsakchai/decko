import { createExternalContext } from '@/context'
import { slideLoaderPlugin } from '@/vite/loaders'

import { decko } from '@decko/decko'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import path from 'node:path'
import type { InlineConfig } from 'vite'
import { searchForWorkspaceRoot, build as viteBuild } from 'vite'

export async function build(root: string) {
	const external = createExternalContext(root)
	if (external.markdowns().length === 0) {
		console.log('markdown file not found!')
		return
	}

	const output = path.resolve(path.join(root, 'dist'))
	const input = external.markdowns().map((m) => [m, path.join(m, 'index.html')])

	const inlineConfig: InlineConfig = {
		configFile: false,
		plugins: [
			slideLoaderPlugin({ external }),
			tailwindcss(),
			svelte({
				extensions: ['.svelte', '.md'],
				preprocess: [decko({ extension: '.md' }), vitePreprocess()]
			})
		],
		server: {
			// Keep the same file access scope as the dev server
			fs: { allow: [searchForWorkspaceRoot(process.cwd()), root] }
		},
		build: {
			outDir: output,
			emptyOutDir: true,
			rolldownOptions: {
				input: Object.fromEntries(input)
			}
		},
		logLevel: 'error',
		clearScreen: false
	}

	console.log('[BUILD] Building...')
	const start = performance.now()

	try {
		await viteBuild(inlineConfig)
		const seconds = ((performance.now() - start) / 1000).toFixed(2)
		console.log(`[BUILD] Done in ${seconds}s -> ${inlineConfig.build!.outDir}`)
	} catch (err) {
		console.error('[BUILD] Failed:', err)
		throw err
	}
}
