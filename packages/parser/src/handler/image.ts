import { Image } from 'mdast'
import { State, defaultHandlers } from 'mdast-util-to-hast'

export function imageHandler(state: State, node: Image) {
	const result = defaultHandlers.image(state, node)
	if (/[^{.*}$]/.test(node.url)) {
		result.properties.src = node.url
	}
	return result
}
