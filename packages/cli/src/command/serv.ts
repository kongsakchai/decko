import { createContext } from '@/context'
import { slideLoaderPlugin } from '@/vite/loaders'
import { slideServerPlugin } from '@/vite/server'

import { decko } from '@decko/decko'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'

import type { InlineConfig } from 'vite'
import { createServer as createViteServer, searchForWorkspaceRoot } from 'vite'

interface Options {
	port: number
}

export async function createServer(root: string, options?: Options) {
	const ctx = createContext(root)

	const inlineConfig: InlineConfig = {
		configFile: false,
		plugins: [
			slideLoaderPlugin(ctx),
			slideServerPlugin(ctx),
			tailwindcss(),
			svelte({
				extensions: ['.svelte', '.md'],
				preprocess: [decko({ extension: '.md' }), vitePreprocess()]
			})
		],
		server: {
			port: options?.port,
			strictPort: options?.port != undefined,
			fs: { allow: [searchForWorkspaceRoot(process.cwd()), root] }
		},
		logLevel: 'error',
		clearScreen: false
	}

	const server = await createViteServer(inlineConfig)
	await server.listen()

	const resolved = server.resolvedUrls?.local[0] ?? `http://localhost:${server.config.server.port}`
	console.log(`[DEV] Start server listened at ${resolved}`)
	return server
}
