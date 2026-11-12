import { describe, expect, it, vi } from 'vitest'

import { applyTransformers, TransformOptions } from '../../src/transformers/index'

describe('applyTransformers', () => {
	it('should register all transformers with options', () => {
		const use = vi.fn()
		const process = { use } as never

		const codeHighlighter = vi.fn(async () => ({ type: 'text', value: '' }))
		const codeContainer = vi.fn(async () => ({ type: 'container', children: [] }))
		const options = {
			codeHighlighter,
			codeContainer,
			customContainer: ['my-box'],
			extensions: [],
			postExtension: [],
			customAlerts: { custom: { title: 'Custom' } }
		} as unknown as TransformOptions

		applyTransformers(process, options)

		expect(use).toHaveBeenCalledTimes(8)
		expect(use.mock.calls[1][1]).toEqual({ highlighter: codeHighlighter, container: codeContainer })
		expect(use.mock.calls[5][1]).toEqual({ customAlerts: options.customAlerts })
		expect(use.mock.calls[6][1]).toEqual({ customContainer: options.customContainer })
		expect(use.mock.calls[7][1]).toEqual({ extensions: [], postExtensions: [] })
	})

	it('should register all transformers without options', () => {
		const use = vi.fn()
		const process = { use } as never

		applyTransformers(process)

		expect(use).toHaveBeenCalledTimes(8)
		expect(use.mock.calls[1][1]).toEqual({ highlighter: undefined, container: undefined })
		expect(use.mock.calls[5][1]).toEqual({ customAlerts: undefined })
		expect(use.mock.calls[6][1]).toEqual({ customContainer: undefined })
		expect(use.mock.calls[7][1]).toEqual({ extensions: undefined, postExtensions: undefined })
	})
})