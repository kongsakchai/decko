import markdown from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import { describe, expect, it } from 'vitest'

import { attributeFromMarkdown } from '../../src/extensions/attribute'
import { attributeBlock, attributeBlockFromMarkdown } from '../../src/extensions/attribute-block'
import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, attributeBlock)
		addFromMarkdownExtensions(this, attributeBlockFromMarkdown, attributeFromMarkdown)
	})

describe('attribute block syntax', async () => {
	it('should return attribute block mdast', async () => {
		const str =
			'decko @{ disable data= _invalid .class-1 .class-2 #id-1 #id-2 title=decko onclick="{onclick}" {...props} }'
		const expected = {
			disable: true,
			title: 'decko',
			data: true,
			class: ['class-1', 'class-2'],
			id: ['id-1', 'id-2'],
			onclick: '{onclick}',
			svelteExpression: ['{...props}']
		}

		const node = parser.parse(str)

		let result: any = undefined
		visit(node, 'attributeBlock', (node) => {
			result = node
		})
		expect(result?.attr).toStrictEqual(expected)
	})

	it('should return empty when attribute empty', async () => {
		const str = 'decko @{}'

		const node = parser.parse(str)

		let result: any = undefined
		visit(node, 'attributeBlock', (node) => {
			result = node
		})
		expect(result?.attr).toBeUndefined()
	})

	it('should return empty when key invalid', async () => {
		const str = 'decko @{ @data={data}}'
		const expected = {}

		const node = parser.parse(str)

		let result: any = undefined
		visit(node, 'attributeBlock', (node) => {
			result = node
		})
		expect(result?.attr).toStrictEqual(expected)
	})

	it('should return undefined when syntax invalid', async () => {
		const testcase = ['decko @', 'decko @{', 'decko @{} decko']

		for (const str of testcase) {
			const node = parser.parse(str)

			let result: any = undefined
			visit(node, 'attributeBlock', (node) => {
				result = node
			})
			expect(result).toBeUndefined()
		}
	})
})
