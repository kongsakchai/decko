import { Link } from 'mdast'
import { State, defaultHandlers } from 'mdast-util-to-hast'

export function linkHandler(state: State, node: Link) {
	const result = defaultHandlers.link(state, node)
	if (/^{.*}$/.test(node.url)) {
		result.properties.href = node.url
	}
	return result
}
