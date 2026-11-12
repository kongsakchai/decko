import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { imageTransformer } from '../../src/transformers/image'
import { SlideContext } from '../../src/types'

function createContext(): SlideContext {
	return {
		slides: [{ breakIndex: 0, global: {} }],
		style: [],
		script: [],
		extra: {}
	}
}

describe('image transformer', () => {
	it('should apply image styles to hProperties', async () => {
		const context = createContext()
		const node = {
			type: 'root',
			children: [
				{
					type: 'image',
					url: 'img.png',
					data: {
						hProperties: {
							w: 100,
							h: '50%',
							styles: 'border:1px solid',
							class: 'rounded',
							contain: true,
							blur: '',
							opacity: 0.5
						}
					}
				}
			]
		}

		const vfile = new VFile({ context })

		const transform = imageTransformer()
		await transform(node, vfile, () => {})

		const image = node.children[0]
		expect(image.data).toMatchObject({ processed: true })
		expect(image.data.hProperties).toEqual({
			styles: 'border:1px solid',
			class: 'rounded',
			style: 'border:1px solid;width:100;height:50%;object-fit:contain;filter:blur(10px) opacity(0.5)'
		})
	})

	it('should skip image without hProperties or already processed', async () => {
		const context = createContext()
		const node: any = {
			type: 'root',
			children: [
				{ type: 'image', url: 'no-data.png' },
				{ type: 'image', url: 'empty-props.png', data: { hProperties: {} } },
				{ type: 'image', url: 'processed.png', data: { processed: true, hProperties: { w: 10 } } }
			]
		}

		const vfile = new VFile({ context })

		const transform = imageTransformer()
		await transform(node, vfile, () => {})

		expect(node.children[0].data).toMatchObject({ processed: true })
		expect(node.children[1].data).toMatchObject({ processed: true })
		expect(node.children[1].data.hProperties).toEqual({})

		expect(node.children[2].data).toMatchObject({ processed: true, hProperties: { w: 10 } })
	})
})