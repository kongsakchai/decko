import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { extensionsTransform } from '../../src/transformers/extensions'
import { Extension, ExtensionContext, PostExtension, SlideContext } from '../../src/types'

function createContext(): SlideContext {
	return {
		slides: [{ breakIndex: 0, global: {} }],
		style: [],
		script: [],
		extra: {}
	}
}

describe('extensions transform', () => {
	it('should apply extensions and post extensions to all nodes', async () => {
		const context = createContext()
		const node = {
			type: 'root',
			children: [{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'hi' }] }]
		}
		const calls: ExtensionContext[] = []
		const applied: string[] = []

		const extension: Extension = (ctx) => {
			calls.push(ctx)
		}
		const postExtension: PostExtension = {
			when: (ctx) => ctx.node.type === 'text',
			extension: (ctx) => {
				applied.push(ctx.node.type)
			}
		}

		const vfile = new VFile({ context })
		const transform = extensionsTransform({
			extensions: [extension],
			postExtensions: [postExtension]
		})
		await transform(node, vfile, () => {})

		expect(calls).toHaveLength(2)
		expect(calls[0].node.type).toBe('heading')
		expect(calls[1].node.type).toBe('text')
		expect(calls[1].currentSlide).toBe(context.slides[0])
		expect(calls[1].attrs).toBe((calls[1].node as any).data.hProperties)
		expect(calls[0].node.data).toEqual({ hProperties: {} })
		expect(calls[1].node.data).toEqual({ hProperties: {} })

		expect(applied).toEqual(['text'])
	})

	it('should keep existing node data', async () => {
		const context = createContext()
		const node: any = {
			type: 'root',
			children: [
				{ type: 'text', value: 'hi', data: { hProperties: { class: 'existing' } } }
			]
		}
		const attrs: ExtensionContext['attrs'][] = []

		const transform = extensionsTransform({
			extensions: [(ctx) => attrs.push(ctx.attrs)]
		})
		await transform(node, new VFile({ context }), () => {})

		expect(attrs).toEqual([{ class: 'existing' }])
		expect(node.children[0].data).toEqual({ hProperties: { class: 'existing' } })
	})

	it('should work without options', async () => {
		const context = createContext()
		const node: any = { type: 'root', children: [{ type: 'text', value: 'hi' }] }

		const transform = extensionsTransform()
		await transform(node, new VFile({ context }), () => {})

		expect(node.children[0].data).toEqual({ hProperties: {} })
	})
})