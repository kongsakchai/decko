import type { Element, ElementContent, Root } from 'hast'
import { toHtml } from 'hast-util-to-html'
import type { Transformer } from 'unified'
import { visit } from 'unist-util-visit'

const PLACEHOLDER = '__SVELTE_EXPRESSION__'
const PLACEHOLDER_PATTERN = new RegExp(`${PLACEHOLDER}(?:="")?`)

const raw = (value: string) => ({ type: 'raw', value }) as unknown as ElementContent

function splitTags(node: Element) {
	const html = toHtml(
		{ ...node, children: [] },
		{ allowDangerousHtml: true, allowDangerousCharacters: true, collapseEmptyAttributes: true }
	)
	const closeTag = `</${node.tagName}>`
	const hasCloseTag = html.endsWith(closeTag)

	return {
		openTag: hasCloseTag ? html.slice(0, -closeTag.length) : html,
		closeTag: hasCloseTag ? closeTag : null
	}
}

export function svelteExpressionTransformer(): Transformer {
	return (tree) => {
		visit(tree as Root, 'element', (node, index, parent) => {
			const expressions = node.properties.svelteExpression as string[] | undefined
			if (!parent || index == null || !expressions?.length) return

			delete node.properties.svelteExpression
			node.properties[PLACEHOLDER] = ''

			const { openTag, closeTag } = splitTags(node)
			const openTagWithExpression = openTag.replace(PLACEHOLDER_PATTERN, () => expressions.join(' '))

			parent.children.splice(
				index,
				1,
				raw(openTagWithExpression),
				...node.children,
				...(closeTag ? [raw(closeTag)] : [])
			)

			return index + 1
		})
	}
}
