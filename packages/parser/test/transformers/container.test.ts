import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { containerTransformer } from '../../src/transformers/container'

describe('container transformer', () => {
	it('should convert unknown container to div with class', async () => {
		const node = {
			type: 'root',
			children: [
				{ type: 'container', data: { hName: 'div', hProperties: {} }, children: [] },
				{ type: 'container', data: { hName: 'my-box', hProperties: {} }, children: [] },
				{
					type: 'container',
					data: { hName: 'my-box', hProperties: { class: 'existing' } },
					children: []
				},
				{ type: 'container', data: { hName: 'custom', hProperties: {} }, children: [] }
			]
		}

		const vfile = new VFile({ context: {} })

		const transform = containerTransformer({ customContainer: ['custom'] })
		await transform(node, vfile, () => {})

		expect(node.children[0].data).toEqual({ hName: 'div', hProperties: {} })

		expect(node.children[1].data).toEqual({ hName: 'div', hProperties: { class: 'my-box' } })

		expect(node.children[2].data).toEqual({
			hName: 'div',
			hProperties: { class: 'my-box existing' }
		})

		expect(node.children[3].data).toEqual({ hName: 'custom', hProperties: {} })
	})

	it('should work without options', async () => {
		const node = {
			type: 'root',
			children: [{ type: 'container', data: { hName: 'my-box', hProperties: {} }, children: [] }]
		}

		const vfile = new VFile({ context: {} })

		const transform = containerTransformer()
		await transform(node, vfile, () => {})

		expect(node.children[0].data).toEqual({ hName: 'div', hProperties: { class: 'my-box' } })
	})

	it('should ignore when tree is the container itself', async () => {
		const node = { type: 'container', data: { hName: 'my-box', hProperties: {} }, children: [] }

		const vfile = new VFile({ context: {} })

		const transform = containerTransformer()
		await transform(node, vfile, () => {})

		expect(node.data).toEqual({ hName: 'my-box', hProperties: {} })
	})
})