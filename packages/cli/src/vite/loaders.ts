import { Context } from '@/context'
import { virtualRoutes } from '@/virtual'

import type { Plugin } from 'vite'

export function slideLoaderPlugin(ctx: Context): Plugin {
	return {
		name: 'decko-loader',
		resolveId(id) {
			const route = virtualRoutes.find((m) => m.match(id))
			if (route) return id

			const absolutePath = ctx.external.resolvePath(id)
			if (absolutePath && absolutePath.isFile) return absolutePath.path

			return null
		},
		async load(id) {
			const route = virtualRoutes.find((m) => m.match(id))
			if (route) {
				const data = route.parse(id)
				return await route.module.content({ ...ctx, data })
			}
		}
	}
}
