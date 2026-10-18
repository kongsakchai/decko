import { Context } from '@/context'
import { virtualEntryHTML } from '@/virtual/html'

import type { Plugin } from 'vite'

export function slideServerPlugin(ctx: Context): Plugin {
	return {
		name: 'decko-server',

		configureServer(server) {
			server.middlewares.use(async (req, resp, next) => {
				const url = req.url || '/'
				const pathname = decodeURI(url.split('?')[0])

				const isNavigation = req.headers['sec-fetch-dest'] === 'document'
				if (!isNavigation) {
					return next()
				}
				const assets = ctx.resolvePath(pathname)
				if (!assets) {
					return next()
				}
				const isMarkdown = pathname.endsWith('.md')
				if (assets.isFile && !isMarkdown) {
					return next()
				}

				const content = await virtualEntryHTML({ ...ctx, data: { module: pathname } })
				const newURL = isMarkdown ? pathname.slice(0, -3) + url.slice(pathname.length) : url
				const html = await server.transformIndexHtml(newURL, content)

				resp.statusCode = 200
				resp.setHeader('Content-Type', 'text/html; charset=utf-8')
				resp.end(html)
			})
		}
	}
}
