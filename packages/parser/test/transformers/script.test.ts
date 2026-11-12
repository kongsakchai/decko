import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { extractScriptTransformer } from '../../src/transformers/script'
import { SlideContext } from '../../src/types'

describe('script transformer', () => {
	it('should extract script, style', async () => {
		const context: SlideContext = {
			slides: [{ breakIndex: 0, global: {} }],
			style: [],
			script: [],
			extra: {}
		}
		const node = {
			type: 'root',
			children: [
				{
					type: 'html',
					value: '<scrip>\nconst data=$state("data")\n</script>'
				},
				{
					type: 'html',
					value: '<script>\nconst data=$state("data")\n</script>'
				},
				{
					type: 'html',
					value: '<script>\ndata=10\n</script>'
				},
				{
					type: 'html',
					value: '<style>\n.btn {\ncolor: red;\n}\n</style>'
				}
			]
		}

		const vfile = new VFile({ context })

		const transform = extractScriptTransformer()
		await transform(node, vfile, () => {})

		expect(context.script).toHaveLength(2)
		expect(context.script).toMatchObject(['\nconst data=$state("data")\n', '\ndata=10\n'])

		expect(context.style).toHaveLength(1)
		expect(context.style).toMatchObject(['\n.btn {\ncolor: red;\n}\n'])
	})

	it('should have no script when no parent', async () => {
		const context: SlideContext = {
			slides: [{ breakIndex: 0, global: {} }],
			style: [],
			script: [],
			extra: {}
		}
		const node = {
			type: 'html',
			value: '<scrip>\nconst data=$state("data")\n</script>'
		}

		const vfile = new VFile({ context })

		const transform = extractScriptTransformer()
		await transform(node, vfile, () => {})

		expect(context.script).toHaveLength(0)
		expect(context.style).toHaveLength(0)
	})
})
