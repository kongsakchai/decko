import markdown from 'remark-parse'
import { unified } from 'unified'
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

describe('container extension', async () => {
	it('should return container', async () => {
		const str = ':::div _invalid .class-1 .class-2 #id-1 #id-2 title=decko\n# heading\n:::'
		const node = parser.parse(str)

		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({
			type: 'container',
			data: { hName: 'div' },
			children: [{ type: 'heading', children: [{ type: 'text', value: 'heading' }] }]
		})
		expect(node.children[0].data).toEqual({
			hName: 'div',
			hProperties: {
				title: 'decko',
				class: ['class-1', 'class-2'],
				id: ['id-1', 'id-2']
			}
		})
	})

	it('should return multiple container', async () => {
		const str = ':::div\n:::div\n# heading\n:::\n'

		const node = parser.parse(str)

		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({
			type: 'container',
			data: { hName: 'div' },
			children: [
				{
					type: 'container',
					data: { hName: 'div' },
					children: [{ type: 'heading', children: [{ type: 'text', value: 'heading' }] }]
				}
			]
		})
	})

	it('should still return container, even if the syntax is incomplete.', async () => {
		const testcase = [':::div', ':::div\n', ':::div\ndecko']

		for (const str of testcase) {
			const node = parser.parse(str)
			expect(node.children[0]).toMatchObject({
				type: 'container',
				data: { hName: 'div' }
			})
		}
	})

	it('should return undefined when syntax invalid', async () => {
		const testcase = [':::', '::::div', '::div']

		for (const str of testcase) {
			const node = parser.parse(str)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph'
			})
		}
	})
})
