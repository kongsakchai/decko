import { Context } from '@/context'
import { EXPLORER_ID } from '@/virtual/explorer'
import { STYLE_ID } from '@/virtual/styles'

import { Plugin, Update, ViteDevServer, normalizePath } from 'vite'

export function slideHmrPlugin(ctx: Context): Plugin {
	let server: ViteDevServer

	function reloadModules(...ids: string[]) {
		const timestamp = Date.now()
		const graph = server.environments.client.moduleGraph
		const updates = ids.flatMap((id) => {
			const mod = graph.getModuleById(id)
			if (!mod) return []
			graph.invalidateModule(mod)
			return [
				{
					type: 'js-update',
					path: mod.url,
					acceptedPath: mod.url,
					timestamp,
					explicitImportRequired: false,
					isWithinCircularImport: false
				}
			] as Update[]
		})

		if (updates.length) server.hot.send({ type: 'update', updates })
	}

	function reloadFull() {
		const graph = server.environments.client.moduleGraph
		graph.invalidateAll()
		return server.hot.send({ type: 'full-reload' })
	}

	function reloadUntracked(file: string) {
		const graph = server.environments.client.moduleGraph
		if (!graph.getModulesByFile(normalizePath(file))?.size) {
			return reloadFull()
		}
	}

	return {
		name: 'decko-hmr',
		configureServer(_server) {
			server = _server

			server.watcher.add(ctx.root)
			server.watcher.on('change', (file) => {
				const resolved = ctx.resolvePath(file)
				if (!resolved) return
				if (resolved.relative.endsWith('.md')) {
					return reloadModules(resolved.relative)
				}

				reloadUntracked(file)
			})
			server.watcher.on('add', (file) => {
				const resolved = ctx.resolvePath(file)
				if (resolved?.relative.endsWith('.md')) {
					return reloadModules(resolved.relative, EXPLORER_ID, STYLE_ID)
				}

				reloadUntracked(file)
			})
			server.watcher.on('unlink', (file) => {
				const resolved = ctx.resolvePath(file)
				if (!resolved) return

				if (resolved.relative.endsWith('.md')) {
					return reloadFull()
				}

				reloadUntracked(file)
			})
		}
	}
}
