import { findMarkdowns, readMarkdown } from '@/content'
import { resolveSlideId, virtualDirectory, virtualModules } from '@/virtual'

import { existsSync, statSync } from 'node:fs'
import type { IncomingMessage, ServerResponse } from 'node:http'
import path, { join } from 'node:path'
import type { Plugin } from 'vite'

export function createSlideLoader(root: string): Plugin {
	const markdowns = new Set(findMarkdowns(root))
	const ctx = { root, markdowns, read: readMarkdown }
	return {
		name: 'decko:loaders',
		configureServer(server) {
			const sendHTML = async (resp: ServerResponse, code: number, url: string, module: string) => {
				const html = await server.transformIndexHtml(url, renderAppHTML(module))
				resp.statusCode = code
				resp.setHeader('Content-Type', 'text/html; charset=utf-8')
				resp.end(html)
			}

			const sendExternalFile = (req: IncomingMessage, absolutePath: string, next: (e?: any) => void) => {
				req.url = join('/@fs/', absolutePath)
				next()
			}

			server.middlewares.use((req, res, next) => {
				const url = req.url ?? '/'
				const pathname = url.split('?')[0]
				const absolutePath = path.join(root, pathname)
				if (!existsSync(absolutePath)) {
					return next()
				}

				const stat = statSync(absolutePath)
				if (stat.isDirectory()) {
					return sendHTML(res, 200, url, virtualDirectory.id as string)
				}
				const isNavigation = req.headers['sec-fetch-dest'] === 'document'
				if (!absolutePath.endsWith('.md') || !isNavigation) {
					return sendExternalFile(req, absolutePath, next)
				}
				return sendHTML(res, 200, url.replace(/\.md$/, ''), resolveSlideId(url))
			})
		},
		resolveId(id) {
			if (id.startsWith('decko:')) {
				return id
			}
			return null
		},
		async load(id) {
			const module = virtualModules.find((m) => (m.id instanceof RegExp ? m.id.test(id) : id === m.id))
			return await module?.content.call({ ...ctx, id })
		}
	}
}

export function renderAppHTML(module: string): string {
	return [
		`<!doctype html>`,
		`<html lang="en">`,
		`<head>`,
		`<meta charset="UTF-8" />`,
		`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
		`<title>Decko</title>`,
		`</head>`,
		`<body>`,
		`<div id="app"></div>`,
		`<script type="module">`,
		`import { mount } from 'svelte'`,
		`import 'decko:app.css'`,
		`import App from '${module}'`,
		`const appElement = document.getElementById('app')`,
		`if (appElement) mount(App, { target: appElement })`,
		`</script>`,
		`</body>`,
		`</html>`
	].join('\n')
}
