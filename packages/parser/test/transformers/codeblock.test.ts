import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { codeblockTransformer, extractAttributes } from '../../src/transformers/codeblock'
import { CodeContainer, CodeContext, CodeHighlighter, SlideContext } from '../../src/types'

function createContext(): SlideContext {
	return {
		slides: [
			{ breakIndex: 0, global: {} },
			{ breakIndex: 1, global: {} }
		],
		style: [],
		script: [],
		extra: {}
	}
}

describe('codeblock transformer', () => {
	it('should transform code with default container and highlighter', async () => {
		const context = createContext()
		const node: any = {
			type: 'root',
			children: [
				{ type: 'code', lang: 'js', meta: 'title=decko .my-class', value: 'const a = {b: 1}' },
				{ type: 'code', value: 'plain', indexGroup: 1 }
			]
		}

		const vfile = new VFile({ context })

		const transform = codeblockTransformer()
		await transform(node, vfile, () => {})

		const first = node.children[0]
		expect(first.type).toBe('container')
		expect(first.data.hName).toBe('div')
		expect(first.data.hProperties).toEqual({ title: 'decko', class: 'language-js my-class' })
		expect(first.data.hChildren[0]).toEqual({
			type: 'raw',
			value: '<span class="lang">js</span>'
		})
		expect(first.data.hChildren[1]).toMatchObject({
			type: 'element',
			tagName: 'pre',
			properties: { lang: 'js' },
			children: [{ type: 'text', value: "const a = {'{'}b: 1{'}'}" }]
		})

		const second = node.children[1]
		expect(second.data.hName).toBe('div')
		expect(second.data.hProperties).toEqual({ class: 'language-plaintext' })
		expect(second.data.hChildren[1]).toMatchObject({
			properties: { lang: 'plaintext' },
			children: [{ type: 'text', value: 'plain' }]
		})
	})

	it('should use custom container and highlighter', async () => {
		const context = createContext()
		const node: any = { type: 'root', children: [{ type: 'code', value: 'x{}' }] }

		const container: CodeContainer = async (ctx: CodeContext) => ({
			type: 'container',
			data: { hName: 'pre', hProperties: ctx.attrs },
			children: []
		})
		const highlighter: CodeHighlighter = async (ctx: CodeContext) => ({
			type: 'element',
			tagName: 'code',
			properties: {},
			children: [{ type: 'text', value: ctx.code }]
		})

		const vfile = new VFile({ context })

		const transform = codeblockTransformer({ container, highlighter })
		await transform(node, vfile, () => {})

		expect(node.children[0].data).toEqual({
			hName: 'pre',
			hProperties: { class: 'language-plaintext' }
		})
	})

	it('should handle container without data', async () => {
		const context = createContext()
		const node = { type: 'root', children: [{ type: 'code', value: 'code' }] }

		const container: CodeContainer = async () => ({ type: 'container', children: [] })
		const highlighter: CodeHighlighter = async () => ({
			type: 'text',
			value: 'highlighted'
		})

		const vfile = new VFile({ context })

		const transform = codeblockTransformer({ container, highlighter })
		await transform(node, vfile, () => {})

		expect(node.children[0]).toEqual({ type: 'container', children: [] })
	})

	it('should ignore when tree is the code node itself', async () => {
		const context = createContext()
		const node = { type: 'code', value: 'const a = 1' }

		const transform = codeblockTransformer()
		await transform(node, new VFile({ context }), () => {})

		expect(node).toEqual({ type: 'code', value: 'const a = 1' })
	})
})

describe('extractAttributes', () => {
	it('should return empty object when no meta', () => {
		expect(extractAttributes()).toEqual({})
		expect(extractAttributes('')).toEqual({})
		expect(extractAttributes(null)).toEqual({})
	})

	it('should extract class, id and attributes', () => {
		expect(extractAttributes('.class-1 .class-2 #id-1 #id-2 title=decko')).toEqual({
			class: 'class-1 class-2',
			id: 'id-1 id-2',
			title: 'decko'
		})
		expect(extractAttributes('title=decko')).toEqual({ title: 'decko' })
		expect(extractAttributes('#only-id')).toEqual({ id: 'only-id' })
	})

	it('should extract quoted and brace values', () => {
		expect(extractAttributes(`class="a b" id='c' title="hello world" data={x + y} disabled`)).toEqual({
			class: 'a b',
			id: 'c',
			title: 'hello world',
			data: '{x + y}',
			disabled: ''
		})
	})

	it('should skip excepted keys and keep @ in class', () => {
		expect(extractAttributes('.@sm:flex w-[10px] w-1/2 p-4')).toEqual({
			class: '@sm:flex',
			'p-4': ''
		})
	})
})