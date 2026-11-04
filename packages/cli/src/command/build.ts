import { Context, createContext } from '@/context'
import { buildReport } from '@/vite/build-report'
import { slideLoaderPlugin } from '@/vite/loaders'

import { decko } from '@decko/decko'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import { rmSync } from 'node:fs'
import path from 'node:path'
import { InlineConfig, build as viteBuild } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

const ENTRY_FILE_NAMES = '[name]-[hash].js'
const CHUNK_FILE_NAMES = 'assets/chunk-[hash].js'
const ASSETS_FILE_NAMES = 'assets/[name]-[hash][extname]'
const CSS_FILE_NAMES = 'assets/styles-[hash][extname]'
const INDEX_HTML = 'index.html'

const INDEX_ENTRY = { index: INDEX_HTML }

type BuildMode = 'shared' | 'isolated' | 'single-file'

interface Options {
	outDir: string
	index: boolean
	isolated: boolean
	single: boolean
	embed: boolean
}

interface ResolvedOptions {
	ctx: Context
	outDir: string
	withIndex: boolean
	mode: BuildMode
	markdowns: string[]
}

export async function build(src: string, options: Options) {
	const resolvedOptions = resolveOptions(src, options)

	console.log(`[BUILD] mode ${resolvedOptions.mode}`)
	console.log('[BUILD] Building...')
	const start = performance.now()

	try {
		await runBuilds(resolvedOptions)
		const seconds = ((performance.now() - start) / 1000).toFixed(2)
		console.log(`\n[BUILD] Done in ${seconds}s`)
	} catch (e) {
		console.error('[BUILD] Failed:', e)
		process.exitCode = 1
	}
}

function resolveMode(options: Options): BuildMode {
	if (options.single) return 'single-file'
	if (options.isolated) return 'isolated'
	return 'shared'
}

function resolveOptions(src: string, options: Options): ResolvedOptions {
	const ctx = createContext(src)
	const markdowns = ctx.markdowns()

	if (markdowns.length === 0) {
		throw new Error('markdown file not found!')
	}

	return {
		ctx,
		mode: resolveMode(options),
		outDir: path.resolve(options.outDir),
		withIndex: ctx.single != null || options.index,
		markdowns: ctx.single ? [] : markdowns
	}
}

async function runBuilds(options: ResolvedOptions) {
	// clear output directory
	rmSync(options.outDir, { force: true, recursive: true })

	if (options.mode === 'shared') return await buildShared(options)
	return await buildStandalone(options)
}

async function buildShared(options: ResolvedOptions) {
	const input = {
		...(options.withIndex && INDEX_ENTRY),
		...Object.fromEntries(options.markdowns.map(markdownEntry))
	}
	await viteBuild(createInlineConfig(input, options))
}

async function buildStandalone(options: ResolvedOptions) {
	if (options.withIndex) {
		await viteBuild(createInlineConfig(INDEX_ENTRY, options))
	}

	for (const m of options.markdowns) {
		await viteBuild(
			createInlineConfig(INDEX_ENTRY, {
				...options,
				ctx: options.ctx.withSingle(m),
				outDir: path.resolve(options.outDir, m)
			})
		)
	}
}

function markdownEntry(markdown: string): [string, string] {
	return [path.posix.join(markdown, 'index'), path.join(markdown, INDEX_HTML)]
}

function createInlineConfig(input: Record<string, string>, { outDir, mode, ctx }: ResolvedOptions): InlineConfig {
	const split = mode !== 'single-file'

	return {
		configFile: false,
		plugins: createPlugins(mode, ctx),
		base: mode === 'isolated' ? './' : '/',
		logLevel: 'error',
		build: {
			outDir,
			emptyOutDir: false,
			cssCodeSplit: split,
			assetsInlineLimit: 0,
			reportCompressedSize: false,
			rolldownOptions: {
				input,
				output: {
					codeSplitting: split,
					entryFileNames: ENTRY_FILE_NAMES,
					chunkFileNames: CHUNK_FILE_NAMES,
					assetFileNames
				}
			}
		}
	}
}

function createPlugins(mode: BuildMode, ctx: Context) {
	return [
		buildReport(),
		slideLoaderPlugin(ctx),
		tailwindcss(),
		svelte({
			extensions: ['.svelte', '.md'],
			preprocess: [decko({ extension: '.md' }), vitePreprocess()]
		}),
		mode === 'single-file' && viteSingleFile({ useRecommendedBuildConfig: false, removeViteModuleLoader: true })
	]
}

function assetFileNames({ names }: { names: string[] }): string {
	return names[0].endsWith('.css') ? CSS_FILE_NAMES : ASSETS_FILE_NAMES
}
