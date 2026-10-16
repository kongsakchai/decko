import { Context } from '@/context'
import { virtualEntryHTML } from '@/virtual/html'

import type { Plugin } from 'vite'

export function slideServerPlugin(ctx: Context): Plugin {
	return {
		name: 'decko-server',

		configureServer(server) {
			server.middlewares.use(async (req, resp, next) => {
				const url = req.url || '/'
				const pathname = url.split('?')[0]
				const isNavigation = req.headers['sec-fetch-dest'] === 'document'
				if (!isNavigation) {
					return next()
				}

				const externalPath = ctx.external.resolvePath(pathname)
				if (!externalPath) {
					return next()
				}
				if (!externalPath.isFile && !ctx.external.isSingle) {
					return next()
				}

				const isSingle = ctx.external.isSingle && pathname === '/'
				const isMarkdown = pathname.endsWith('.md')
				if (!isSingle && !isMarkdown) {
					return next()
				}

				const module = isSingle ? ctx.external.markdown(0) : pathname
				if (!module) {
					return next()
				}
				const content = await virtualEntryHTML({ ...ctx, data: { module } })
				const newURL = isSingle ? url : pathname.slice(0, -3) + url.slice(pathname.length)
				const html = await server.transformIndexHtml(newURL, content)

				resp.statusCode = 200
				resp.setHeader('Content-Type', 'text/html; charset=utf-8')
				resp.end(html)
			})
		}
	}
}
