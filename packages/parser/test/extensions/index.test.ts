import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import {
	addFromMarkdownExtensions,
	addMicromarkExtensions,
	deckoExtension
} from '../../src/extensions/index'
import { highlight, highlightFromMarkdown } from '../../src/extensions/highlight'

interface ExtensionData {
	micromarkExtensions?: unknown[]
	fromMarkdownExtensions?: unknown[]
}

function getData(processor: ReturnType<typeof unified>) {
	return processor.data() as ExtensionData
}

describe('extensions index', () => {
	it('should register all decko extensions', () => {
		const processor = unified()
		deckoExtension.call(processor)

		expect(getData(processor).micromarkExtensions).toHaveLength(9)
		expect(getData(processor).fromMarkdownExtensions).toHaveLength(7)
	})

	it('should append extensions to existing list', () => {
		const processor = unified()

		addMicromarkExtensions(processor, highlight)
		addMicromarkExtensions(processor, highlight)
		addFromMarkdownExtensions(processor, highlightFromMarkdown)
		addFromMarkdownExtensions(processor, highlightFromMarkdown)

		expect(getData(processor).micromarkExtensions).toEqual([highlight, highlight])
		expect(getData(processor).fromMarkdownExtensions).toEqual([
			highlightFromMarkdown,
			highlightFromMarkdown
		])
	})
})