import { ExternalContext, createExternalContext } from '@/context'
import { slideLoaderPlugin } from '@/vite/loaders'

import { decko } from '@decko/decko'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import path from 'node:path'
import { type InlineConfig, build as viteBuild } from 'vite'

interface Options {
	output: string
	index: boolean
	isolated: boolean
}

export async function build(src: string, options: Options) {
	const output = path.resolve(options.output)
	const external = createExternalContext(src)
	const markdowns = external.markdowns()

	if (markdowns.length === 0) {
		console.log('markdown file not found!')
		return
	}

	console.log('[BUILD] Building...')
	const start = performance.now()

	try {
		const input = { index: 'index.html' }
		const inlineConfig = createInlineConfig(external, output, input, true)
		await viteBuild(inlineConfig)
		const seconds = ((performance.now() - start) / 1000).toFixed(2)
		console.log(`[BUILD] Done in ${seconds}s -> ${output}`)
	} catch (err) {
		console.error('[BUILD] Failed:', err)
		throw err
	}
}

function createInlineConfig(
	external: ExternalContext,
	output: string,
	input: Record<string, string>,
	emptyOutDir: boolean = false
): InlineConfig {
	return {
		configFile: false,
		plugins: [
			slideLoaderPlugin({ external }),
			tailwindcss(),
			svelte({
				extensions: ['.svelte', '.md'],
				preprocess: [decko({ extension: '.md' }), vitePreprocess()]
			})
		],
		build: {
			outDir: output,
			emptyOutDir: emptyOutDir,
			rolldownOptions: {
				input: input,
				output: {
					entryFileNames: '[name]-[hash].js',
					chunkFileNames: 'assets/[name]-[hash].js',
					assetFileNames: (fileInfo) => {
						if (fileInfo.names[0].endsWith('.css')) {
							return 'assets/styles-[hash][extname]'
						}
						return 'assets/[name]-[hash][extname]'
					}
				}
			}
		},
		logLevel: 'error',
		clearScreen: false
	}
}
