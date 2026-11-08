import { Paragraph, Text } from 'mdast'
import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'
import { subscript, subscriptFromMarkdown } from '../../src/extensions/subscript'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, subscript)
		addFromMarkdownExtensions(this, subscriptFromMarkdown)
	})

describe('subscript extension', async () => {
	it('should return subscript', async () => {
		const node = parser.parse('~a~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'a' }]
		})
	})

	it('should return multiple subscript', async () => {
		const node = parser.parse('x ~a~ y ~b~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(4)
		expect(paragraph.children[0]).toMatchObject({ type: 'text', value: 'x ' })
		expect(paragraph.children[1]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[2]).toMatchObject({ type: 'text', value: ' y ' })
		expect(paragraph.children[3]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'b' }]
		})
	})

	it('should return inline constructs inside subscript', async () => {
		const node = parser.parse('~*a*~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [
				{
					type: 'emphasis',
					children: [{ type: 'text', value: 'a' }]
				}
			]
		})
	})

	it('should return subscript inside emphasis', () => {
		const node = parser.parse('*~a~*')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'emphasis',
			children: [
				{
					type: 'sub',
					data: { hName: 'sub' },
					children: [{ type: 'text', value: 'a' }]
				}
			]
		})
	})

	it('should return subscript, even if line endings inside a subscript', () => {
		const node = parser.parse('~a\bb~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'a\bb' }]
		})
	})

	it('should return text when only a double `=`', () => {
		const node = parser.parse('~~decko~~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: '~~decko~~'
		})
	})

	it('should return normal when start with escaped', () => {
		const node = parser.parse('\\~decko~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: '~decko~'
		})
	})

	it('should pair the first two sequences and leave the trailing ~ as text', () => {
		const node = parser.parse('~a~b~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'text',
			value: 'b~'
		})
	})

	it('should produce two separate subscripts from four ~ sequences', () => {
		const node = parser.parse('~a~b~c~')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(3)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'text',
			value: 'b'
		})
		expect(paragraph.children[2]).toMatchObject({
			type: 'sub',
			data: { hName: 'sub' },
			children: [{ type: 'text', value: 'c' }]
		})
	})

	it('should return normal when when syntax invalid', () => {
		const testcase = ['a~~b', '~~a~=', '~ a ~']

		for (const str of testcase) {
			const node = parser.parse(str)
			expect(node.children).toHaveLength(1)
			expect(node.children[0].type).toBe('paragraph')

			const text = (node.children[0] as Paragraph).children[0] as Text
			expect(text.value).toBe(str)
		}
	})
})
