import markdown from 'remark-parse'
import { unified } from 'unified'
import { EXIT, visit } from 'unist-util-visit'
import { describe, expect, it } from 'vitest'

import { attributeFromMarkdown } from '../../src/extensions/attribute'
import { container, containerFromMarkdown } from '../../src/extensions/container'
import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, container)
		addFromMarkdownExtensions(this, containerFromMarkdown, attributeFromMarkdown)
	})

describe('container syntax', async () => {
	it('should return container', async () => {
		const str = ':::div _invalid .class-1 .class-2 #id-1 #id-2 title=decko\n# decko\n:::'
		const attributeExpected = {
			title: 'decko',
			class: ['class-1', 'class-2'],
			id: ['id-1', 'id-2']
		}

		const node = parser.parse(str)

		let result: any = undefined
		visit(node, 'container', (node) => {
			result = node
		})
		expect(result.data.hName).toEqual('div')
		expect(result.data.hProperties).toStrictEqual(attributeExpected)
		expect(result.children.length).toEqual(1)
		expect(result.children[0].type).toEqual('heading')
	})

	it('should return multiple container', async () => {
		const str = ':::div\n:::div\n# decko\n:::\n'

		const node = parser.parse(str)

		let result: any = undefined
		visit(node, 'container', (node) => {
			result = node
			return EXIT
		})

		expect(result.data.hName).toEqual('div')
		expect(result.children.length).toEqual(1)
		expect(result.children[0].type).toEqual('container')
		expect(result.children[0].children.length).toEqual(1)
		expect(result.children[0].children[0].type).toEqual('heading')
	})

	it('should still return container,even if the syntax is incomplete.', async () => {
		const testcase = [':::div', ':::div\n', ':::div\ndecko']

		for (const str of testcase) {
			const node = parser.parse(str)

			let result: any = undefined
			visit(node, 'container', (node) => {
				result = node
			})
			expect(result.data.hName).toEqual('div')
		}
	})

	it('should return undefined when syntax invalid', async () => {
		const testcase = [':::', '::::div', '::div']

		for (const str of testcase) {
			const node = parser.parse(str)

			let result: any = undefined
			visit(node, 'container', (node) => {
				result = node
			})
			expect(result).toBeUndefined()
		}
	})
})
