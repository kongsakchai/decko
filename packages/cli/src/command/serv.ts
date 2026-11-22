import { bold, cyan, green } from '@/console'
import { createContext } from '@/context'
import { viteDecko } from '@/vite'

import { decko } from '@deckomd/decko'
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
			...viteDecko(ctx),
			tailwindcss(),
			svelte({
				extensions: ['.svelte', '.md'],
				preprocess: [decko({ extension: '.md' }), vitePreprocess()]
			})
		],
		server: {
			port: options?.port,
			strictPort: options?.port != null,
			fs: { allow: [searchForWorkspaceRoot(process.cwd()), root] }
		},
		logLevel: 'error',
		clearScreen: false
	}

	const server = await createViteServer(inlineConfig)
	await server.listen()

	const resolved = server.resolvedUrls?.local[0] ?? `http://localhost:${server.config.server.port}`
	console.log(`${bold(green('[DEV]'))} Start server listened at ${cyan(resolved)}`)
	return server
}
