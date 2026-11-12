import { VFile } from 'vfile'
import { describe, expect, it, vi } from 'vitest'

import { directiveTransformer, parseYAML } from '../../src/transformers/directive'
import { SlideContext } from '../../src/types'

describe('directive transformer', () => {
	it('should merge directive into slide', async () => {
		const context: SlideContext = {
			slides: [{ breakIndex: 0, global: { a: 1 }, local: { b: 1 } }],
			style: [],
			script: [],
			extra: {}
		}
		const node: any = {
			type: 'root',
			children: [
				{ type: 'html', value: '<!--\ntitle: Hello\n-->' },
				{ type: 'html', value: '<!--global\ntheme: dark\n-->' },
				{ type: 'html', value: '<!--\n-->' },
				{ type: 'html', value: '<!--\nnot yaml: [\n-->' },
				{ type: 'html', value: '<div>plain</div>' },
				{
					type: 'blockquote',
					children: [{ type: 'html', value: '<!--global\nnested: true\n-->' }]
				},
				{ type: 'html', value: '<!--\nfoo: bar\n-->', indexGroup: 5 }
			]
		}

		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const vfile = new VFile({ context })

		const transform = directiveTransformer()
		await transform(node, vfile, () => {})

		expect(warn).toHaveBeenCalledOnce()
		warn.mockRestore()

		expect(context.slides[0].local).toEqual({ b: 1, title: 'Hello' })
		expect(context.slides[0].global).toEqual({ a: 1, theme: 'dark' })

		expect(node.children).toHaveLength(5)
		expect(node.children[0]).toEqual({ type: 'html', value: '<!--\n-->' })
		expect(node.children[1]).toEqual({ type: 'html', value: '<!--\nnot yaml: [\n-->' })
		expect(node.children[2]).toEqual({ type: 'html', value: '<div>plain</div>' })
		expect(node.children[3].children[0]).toEqual({
			type: 'html',
			value: '<!--global\nnested: true\n-->'
		})
		expect(node.children[4]).toMatchObject({ value: '<!--\nfoo: bar\n-->', indexGroup: 5 })
	})
})

describe('parseYAML', () => {
	it('should parse valid yaml', () => {
		expect(parseYAML('title: Hello')).toEqual({ title: 'Hello' })
	})

	it('should return empty object and warn when yaml invalid', () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

		expect(parseYAML('foo: [')).toEqual({})
		expect(warn).toHaveBeenCalledOnce()

		warn.mockRestore()
	})
})