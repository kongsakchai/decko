import { Context } from '@/context'
import { virtualEntryHTML } from '@/virtual/html'
import { createSlideModuleId } from '@/virtual/slide'

import { existsSync, statSync } from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

export function slideServerPlugin(ctx: Context): Plugin {
	return {
		name: 'decko-server',
		configureServer(server) {
			server.middlewares.use(async (req, resp, next) => {
				const url = req.url ?? '/'
				const pathname = url.split('?')[0]
				const absolutePath = path.join(ctx.external.root, pathname)

				if (!existsSync(absolutePath)) {
					return next()
				}

				if (statSync(absolutePath).isDirectory()) {
					return next()
				}

				const isNavigation = req.headers['sec-fetch-dest'] === 'document'
				if (isNavigation && url.endsWith('.md')) {
					const content = await virtualEntryHTML.content({
						...ctx,
						data: { module: createSlideModuleId(url) }
					})
					const html = await server.transformIndexHtml(url.slice(0, -3), content)
					resp.statusCode = 200
					resp.setHeader('Content-Type', 'text/html; charset=utf-8')
					resp.end(html)
					return
				}

				return next()
			})
		}
	}
}
