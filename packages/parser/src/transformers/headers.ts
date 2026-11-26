import type { Root } from 'mdast'
import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'

import { SlideContext } from '../types.js'

export function alertTransformer(): Transformer {
	return (tree, vfile) => {
		const ctx = vfile.context as SlideContext
		visit(tree as Root, 'heading', (node, index, parent) => {
			if (typeof index !== 'number' || !parent) return

			let text = ''
			for (const n of node.children) {
				if (n.type === 'text') text += n.value
			}

			ctx.heading.push({
				depth: node.depth,
				text: text,
				index: node.indexGroup ?? 0
			})
		})
	}
}
