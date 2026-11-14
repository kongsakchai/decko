import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { svelteExpressionTransformer } from '../../src/html/index'

describe('svelte expression transformer', () => {
	it('should replace svelte expression with raw open tag and close tag', async () => {
		const node: any = {
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'p',
					properties: {},
					children: [
						{
							type: 'element',
							tagName: 'span',
							properties: { svelteExpression: ['a', 'b'] },
							children: [{ type: 'text', value: 'Hi' }]
						}
					]
				}
			]
		}

		const transform = svelteExpressionTransformer()
		await transform(node, new VFile(), () => {})

		expect(node.children[0].children).toEqual([
			{ type: 'raw', value: '<span a b>' },
			{ type: 'text', value: 'Hi' },
			{ type: 'raw', value: '</span>' }
		])
	})

	it('should not append close tag for void element', async () => {
		const node: any = {
			type: 'root',
			children: [
				{
					type: 'element',
					tagName: 'img',
					properties: { svelteExpression: ['src={img}'], alt: 'pic' },
					children: []
				}
			]
		}

		const transform = svelteExpressionTransformer()
		await transform(node, new VFile(), () => {})

		expect(node.children).toEqual([{ type: 'raw', value: '<img alt="pic" src={img}>' }])
	})

	it('should skip element without svelte expression', async () => {
		const node: any = {
			type: 'root',
			children: [
				{ type: 'element', tagName: 'p', properties: {}, children: [] },
				{
					type: 'element',
					tagName: 'b',
					properties: { svelteExpression: [] },
					children: []
				}
			]
		}

		const transform = svelteExpressionTransformer()
		await transform(node, new VFile(), () => {})

		expect(node.children[0].properties).toEqual({})
		expect(node.children[1].properties).toEqual({ svelteExpression: [] })
	})

	it('should skip when tree has no parent', async () => {
		const node: any = {
			type: 'element',
			tagName: 'span',
			properties: { svelteExpression: ['a'] },
			children: []
		}

		const transform = svelteExpressionTransformer()
		await transform(node, new VFile(), () => {})

		expect(node.properties).toEqual({ svelteExpression: ['a'] })
	})
})