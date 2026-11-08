import { Paragraph, Text } from 'mdast'
import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'
import { superscript, superscriptFromMarkdown } from '../../src/extensions/superscript'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, superscript)
		addFromMarkdownExtensions(this, superscriptFromMarkdown)
	})

describe('superscript extension', async () => {
	it('should return superscript', async () => {
		const node = parser.parse('^a^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'a' }]
		})
	})

	it('should return multiple superscript', async () => {
		const node = parser.parse('x ^a^ y ^b^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(4)
		expect(paragraph.children[0]).toMatchObject({ type: 'text', value: 'x ' })
		expect(paragraph.children[1]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[2]).toMatchObject({ type: 'text', value: ' y ' })
		expect(paragraph.children[3]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'b' }]
		})
	})

	it('should return inline constructs inside superscript', async () => {
		const node = parser.parse('^*a*^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [
				{
					type: 'emphasis',
					children: [{ type: 'text', value: 'a' }]
				}
			]
		})
	})

	it('should return superscript inside emphasis', () => {
		const node = parser.parse('*^a^*')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'emphasis',
			children: [
				{
					type: 'sup',
					data: { hName: 'sup' },
					children: [{ type: 'text', value: 'a' }]
				}
			]
		})
	})

	it('should return superscript, even if line endings inside a superscript', () => {
		const node = parser.parse('^a\bb^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'a\bb' }]
		})
	})

	it('should return text when only a double `=`', () => {
		const node = parser.parse('^^decko^^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: '^^decko^^'
		})
	})

	it('should return normal when start with escaped', () => {
		const node = parser.parse('\\^decko^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: '^decko^'
		})
	})

	it('should pair the first two sequences and leave the trailing ^ as text', () => {
		const node = parser.parse('^a^b^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'text',
			value: 'b^'
		})
	})

	it('should produce two separate superscripts from four ^ sequences', () => {
		const node = parser.parse('^a^b^c^')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(3)
		expect(paragraph.children[0]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'text',
			value: 'b'
		})
		expect(paragraph.children[2]).toMatchObject({
			type: 'sup',
			data: { hName: 'sup' },
			children: [{ type: 'text', value: 'c' }]
		})
	})

	it('should return normal when when syntax invalid', () => {
		const testcase = ['a^^b', '^^a^=', '^ a ^']

		for (const str of testcase) {
			const node = parser.parse(str)
			expect(node.children).toHaveLength(1)
			expect(node.children[0].type).toBe('paragraph')

			const text = (node.children[0] as Paragraph).children[0] as Text
			expect(text.value).toBe(str)
		}
	})
})
