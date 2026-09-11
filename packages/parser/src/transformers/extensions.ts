import { Node, Parent, Root } from 'mdast'
import type { Transformer } from 'unified'
import { visitParents } from 'unist-util-visit-parents'

import { Attribute, Extension, ExtensionContext, ExtensionOptions, PostExtension, SlideContext } from '../types.js'

function createContext(ctx: SlideContext, root: Root, node: Node, parent: Parent[]): ExtensionContext | undefined {
	let attribute = node.data?.hProperties as Attribute | undefined
	if (!attribute) attribute = {}

	return {
		root,
		node,
		parents: parent,

		attribute,
		slideCtx: ctx,
		slideData: ctx.slides[node.indexGroup ?? 0]
	}
}

export function extensionsTransform(opt?: ExtensionOptions): Transformer {
	const extensions: Extension[] = opt?.extensions ?? []
	const postExtensions: PostExtension[] = opt?.postExtensions ?? []

	return (tree, vfile) => {
		const ctx = vfile.data.context as SlideContext
		const root = tree as Root
		const postQueue: { apply: Extension; ctx: ExtensionContext }[] = []

		visitParents(root, (node, ancestors) => {
			// no parent
			if (ancestors.length == 0) return

			const attrCtx = createContext(ctx, root, node, ancestors)
			if (!attrCtx) return

			for (const process of extensions) {
				process(attrCtx)
			}

			for (const post of postExtensions) {
				if (post.when(attrCtx)) postQueue.push({ ctx: attrCtx, apply: post.extension })
			}
		})

		for (const post of postQueue) {
			post.apply(post.ctx)
		}
	}
}
