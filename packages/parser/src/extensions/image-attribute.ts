import type { CompileContext, Extension as FromMarkdownExtension } from 'mdast-util-from-markdown'
import { codes, types } from 'micromark-util-symbol'
import { Code, Construct, Effects, Extension, State, TokenizeContext } from 'micromark-util-types'
import { visit } from 'unist-util-visit'

import { createAttributeTokenize } from './attribute.js'

// Tokenize

const partialAttributeTokenizer: Construct = {
	partial: true,
	tokenize(this: TokenizeContext, effects, ok, nok) {
		return createAttributeTokenize(effects, ok, nok, codes.rightSquareBracket, true)
	}
}

const imageAttributeTokenizer: Construct = {
	name: 'attributeImage',
	concrete: true,
	tokenize(this: TokenizeContext, effects: Effects, ok: State, nok: State) {
		const { events } = this

		function start(code: Code) {
			if (events.length === 0 || events[0][1].type !== types.labelImage) return nok(code)
			effects.enter('attributeImage')
			effects.consume(code)
			return effects.attempt(partialAttributeTokenizer, closeAttribute, closeAttribute)
		}

		function closeAttribute(code: Code) {
			effects.exit('attributeImage')
			return ok(code)
		}

		return start
	}
}

export const imageAttribute: Extension = {
	text: { [codes.verticalBar]: imageAttributeTokenizer }
}

// From markdown

export const imageAttributeFromMarkdown: FromMarkdownExtension = {
	exit: { attributeImage: exitAttributeImage }
}

function exitAttributeImage(this: CompileContext) {
	for (let index = this.stack.length - 1; index > 0; index--) {
		const node = this.stack[index]
		if (node?.type !== 'image') continue

		node.data ??= { hProperties: {} }
		node.data.hProperties = { ...node.data.hProperties, ...this.data.attr }
		node.title = node.title ?? node.data.hProperties.title

		// cleanup reserved field
		delete node.data.hProperties.title
		delete node.data.hProperties.url

		// trim alt image
		const fragment = this.stack[index + 1]
		visit(fragment, 'text', (node) => {
			node.value = node.value.trim()
		})

		break
	}
}
