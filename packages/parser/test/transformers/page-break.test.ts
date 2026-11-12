import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { PAGE_BREAK_KEY, pageBreakTransformer } from '../../src/transformers/page-break'
import { SlideContext } from '../../src/types'

describe('page break transformer', () => {
	it('should split slides by thematic break', async () => {
		const context: SlideContext = {
			slides: [{ breakIndex: 0, global: {} }],
			style: [],
			script: [],
			extra: {}
		}
		const node: any = {
			type: 'root',
			children: [
				{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'slide 1' }] },
				{ type: 'thematicBreak' },
				{ type: 'heading', depth: 1, children: [{ type: 'text', value: 'slide 2' }] },
				{ type: 'blockquote', children: [{ type: 'thematicBreak' }] }
			]
		}

		const vfile = new VFile({ context })

		const transform = pageBreakTransformer()
		await transform(node, vfile, () => {})

		expect(context.slides).toHaveLength(2)
		expect(context.slides[1]).toMatchObject({ breakIndex: 1 })

		expect(node.children).toHaveLength(4)
		expect(node.children[1]).toEqual({ type: 'text', value: PAGE_BREAK_KEY })

		expect(node.children[0]).toMatchObject({ indexGroup: 0 })
		expect(node.children[2]).toMatchObject({ indexGroup: 1 })
		expect(node.children[3]).toMatchObject({ indexGroup: 1 })
		expect(node.children[3].children[0]).toMatchObject({ indexGroup: 1 })
	})

	it('should not create slide when tree has no thematic break', async () => {
		const context: SlideContext = {
			slides: [{ breakIndex: 0, global: {} }],
			style: [],
			script: [],
			extra: {}
		}
		const node = {
			type: 'root',
			children: [{ type: 'paragraph', children: [{ type: 'text', value: 'content' }] }]
		}

		const vfile = new VFile({ context })

		const transform = pageBreakTransformer()
		await transform(node, vfile, () => {})

		expect(context.slides).toHaveLength(1)
		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({ indexGroup: 0 })
	})
})