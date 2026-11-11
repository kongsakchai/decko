import { Paragraph } from 'mdast'
import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { attributeFromMarkdown } from '../../src/extensions/attribute'
import { imageAttribute, imageAttributeFromMarkdown } from '../../src/extensions/image-attribute'
import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, imageAttribute)
		addFromMarkdownExtensions(this, imageAttributeFromMarkdown, attributeFromMarkdown)
	})

describe('image attribute extension', async () => {
	it('should return image with attribute', async () => {
		const str = '![alt | _invalid .class-1 .class-2 #id-1 #id-2 title=decko](host "title")'
		const node = parser.parse(str)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'image',
			title: 'title',
			alt: 'alt',
			url: 'host'
		})
		expect(paragraph.children[0].data).toEqual({
			hProperties: {
				class: ['class-1', 'class-2'],
				id: ['id-1', 'id-2']
			}
		})
	})

	it('should return image with attribute', async () => {
		const str = '![ *alt* | .class-1\n.class-2](host "title")'
		const node = parser.parse(str)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'image',
			title: 'title',
			alt: 'alt',
			url: 'host'
		})
		expect(paragraph.children[0].data).toEqual({
			hProperties: {
				class: ['class-1', 'class-2']
			}
		})
	})

	it('should return image with empty attribute', async () => {
		const str = '![ *alt* |](host "title")'
		const node = parser.parse(str)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'image',
			title: 'title',
			alt: 'alt',
			url: 'host'
		})
		expect(paragraph.children[0].data).toEqual({
			hProperties: {}
		})
	})

	it('should return text when image label are not before', async () => {
		const str = 'data | .class-1 .class-2'
		const node = parser.parse(str)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: str
		})
	})

	it('should return text when pipe is first', async () => {
		const str = '| .class-1 .class-2'
		const node = parser.parse(str)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: str
		})
	})
})
