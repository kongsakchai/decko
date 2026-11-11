import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { htmlText } from '../../src/extensions/html-text'
import { addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, htmlText)
	})

describe('html text extension', async () => {
	it('should return inline div', async () => {
		const node = parser.parse('decko <div>decko</div>')
		expect(node.children).toHaveLength(1)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko '
				},
				{
					type: 'html',
					value: '<div>'
				},
				{
					type: 'text',
					value: 'decko'
				},
				{
					type: 'html',
					value: '</div>'
				}
			]
		})
	})

	it('should return inline div and text on next line', async () => {
		const node = parser.parse('decko <div>\ndecko</div>')
		expect(node.children).toHaveLength(1)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko '
				},
				{
					type: 'html',
					value: '<div>'
				},
				{
					type: 'text',
					value: '\ndecko'
				},
				{
					type: 'html',
					value: '</div>'
				}
			]
		})
	})

	it('should return inline div and end when contains blank line after', async () => {
		const node = parser.parse('decko <div>\n\ndecko\n</div>')
		expect(node.children).toHaveLength(3)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko '
				},
				{
					type: 'html',
					value: '<div>'
				}
			]
		})
		expect(node.children[1]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko'
				}
			]
		})
		expect(node.children[2]).toMatchObject({
			type: 'html',
			value: '</div>'
		})
	})

	it('should return inline div with svelte attribute', async () => {
		const node = parser.parse('decko <div transition:fade={{duration:10}} onclick={()=>console.log("decko")}>')
		expect(node.children).toHaveLength(1)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko '
				},
				{
					type: 'html',
					value: '<div transition:fade={{duration:10}} onclick={()=>console.log("decko")}>'
				}
			]
		})
	})

	it('should return inline div with mutiple line attribute', async () => {
		const node = parser.parse('decko <div onclick={()=>{\nconsole.log("decko")\n}}>')
		expect(node.children).toHaveLength(1)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko '
				},
				{
					type: 'html',
					value: '<div onclick={()=>{\nconsole.log("decko")\n}}>'
				}
			]
		})
	})

	it('should return only text when contain blank line in inline html', async () => {
		const node = parser.parse('decko <div onclick={()=>{\n\nconsole.log("decko")\n}}>')
		expect(node.children).toHaveLength(2)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko <div onclick={()=>{'
				}
			]
		})
		expect(node.children[1]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'console.log("decko")\n}}>'
				}
			]
		})
	})

	it('should return inline components', async () => {
		const node = parser.parse('decko <Component/>')
		expect(node.children).toHaveLength(1)

		expect(node.children[0]).toMatchObject({
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'decko '
				},
				{
					type: 'html',
					value: '<Component/>'
				}
			]
		})
	})

	it('should return only text when invalid syntax', async () => {
		const testcase = ['decko <Component//>', 'decko <Component@>']

		for (const t of testcase) {
			const node = parser.parse(t)
			expect(node.children).toHaveLength(1)

			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: t.trim() }]
			})
		}
	})
})
