import { Context } from '@/context'
import { EXPLORER_ID } from '@/virtual/explorer'
import { STYLE_ID } from '@/virtual/styles'

import path from 'node:path'
import { EnvironmentModuleNode, Plugin, Update } from 'vite'

const moduleToUpdate = (module: EnvironmentModuleNode, timestamp: number) => {
	return {
		type: 'js-update',
		path: module.url,
		acceptedPath: module.url,
		timestamp,
		explicitImportRequired: false,
		isWithinCircularImport: false
	} as Update
}

export function slideHmrPlugin(ctx: Context): Plugin {
	return {
		name: 'decko-hmr',
		configureServer(server) {
			const graph = server.environments.client.moduleGraph

			const reloadOutside = (file: string) => {
				if (graph.getModulesByFile(file)?.size === 0) {
					server.hot.send({ type: 'full-reload' })
				}
			}

			const reloadJS = (ids: string[]) => {
				const timestamp = Date.now()
				const updates = ids.flatMap((id) => {
					const module = graph.getModuleById(id)
					if (!module) return []
					graph.invalidateModule(module)
					return moduleToUpdate(module, timestamp)
				})

				if (updates.length) {
					server.hot.send({ type: 'update', updates })
				}
			}

			const update = (file: string) => {
				const relative = path.relative(ctx.root, file)
				if (!relative) return
				if (!relative.endsWith('.md')) {
					return reloadOutside(file)
				}

				reloadJS([relative])
			}

			const add = (file: string) => {
				const relative = path.relative(ctx.root, file)
				if (!relative) return
				if (!relative.endsWith('.md')) {
					return reloadOutside(file)
				}

				reloadJS([EXPLORER_ID, STYLE_ID])
			}

			const unlink = (file: string) => {
				const relative = path.relative(ctx.root, file)
				if (!relative) return
				if (!relative.endsWith('.md')) {
					return reloadOutside(file)
				}

				reloadJS([relative, EXPLORER_ID, STYLE_ID])
			}

			server.watcher.add(ctx.root)
			server.watcher.on('change', update)
			server.watcher.on('add', add)
			server.watcher.on('unlink', unlink)
		}
	}
}
