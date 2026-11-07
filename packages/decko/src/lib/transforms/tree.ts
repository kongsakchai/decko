import { type PostExtension, type RootContent } from '@deckomd/parser'

import { asString } from '../logic/utils.js'

export const hoistExtension: PostExtension = {
	when: (ctx) => {
		return (
			ctx.attrs.bg != null ||
			!!asString(ctx.attrs.class)?.includes('absolute') ||
			!!asString(ctx.attrs.style)?.includes('absolute')
		)
	},
	extension: (ctx) => {
		if (ctx.parents.length < 2) return

		const node = ctx.node as RootContent
		const parent = ctx.parents[ctx.parents.length - 1]
		const grand = ctx.parents[ctx.parents.length - 2]

		const index = parent.children.indexOf(node)
		const grandIndex = grand.children.indexOf(parent as RootContent)
		if (index === -1 || grandIndex === -1) return

		parent.children.splice(index, 1)
		grand.children.splice(grandIndex, 0, node)
		if (parent.children.length === 0) {
			const emptyIndex = grand.children.indexOf(parent as RootContent)
			grand.children.splice(emptyIndex, 1)
		}
	}
}
