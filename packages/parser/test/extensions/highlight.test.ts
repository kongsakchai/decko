import { Paragraph, Text } from 'mdast'
import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { highlight, highlightFromMarkdown } from '../../src/extensions/highlight'
import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, highlight)
		addFromMarkdownExtensions(this, highlightFromMarkdown)
	})

describe('highlight extension', async () => {
	it('should return highlight', async () => {
		const node = parser.parse('==a==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'a' }]
		})
	})

	it('should return multiple highlight', async () => {
		const node = parser.parse('x ==a== y ==b==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(4)
		expect(paragraph.children[0]).toMatchObject({ type: 'text', value: 'x ' })
		expect(paragraph.children[1]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[2]).toMatchObject({ type: 'text', value: ' y ' })
		expect(paragraph.children[3]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'b' }]
		})
	})

	it('should return inline constructs inside highlight', async () => {
		const node = parser.parse('==*a*==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [
				{
					type: 'emphasis',
					children: [{ type: 'text', value: 'a' }]
				}
			]
		})
	})

	it('should return highlight inside emphasis', () => {
		const node = parser.parse('*==a==*')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'emphasis',
			children: [
				{
					type: 'highlight',
					data: { hName: 'mark' },
					children: [{ type: 'text', value: 'a' }]
				}
			]
		})
	})

	it('should return highlight, even if line endings inside a highlight', () => {
		const node = parser.parse('==a\bb==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'a\bb' }]
		})
	})

	it('should return text when only a single `=`', () => {
		const node = parser.parse('=decko=')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: '=decko='
		})
	})

	it('should return normal when start with escaped', () => {
		const node = parser.parse('\\==decko==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: '==decko=='
		})
	})

	it('should pair the first two sequences and leave the trailing == as text', () => {
		const node = parser.parse('==a==b==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.children[0]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'text',
			value: 'b=='
		})
	})

	it('should produce two separate highlights from four == sequences', () => {
		const node = parser.parse('==a==b==c==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(3)
		expect(paragraph.children[0]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'a' }]
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'text',
			value: 'b'
		})
		expect(paragraph.children[2]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [{ type: 'text', value: 'c' }]
		})
	})

	it('should produce two separate highlights from four == sequences', () => {
		const node = parser.parse('==a ==b== c==')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(1)
		expect(paragraph.children[0]).toMatchObject({
			type: 'highlight',
			data: { hName: 'mark' },
			children: [
				{ type: 'text', value: 'a ' },
				{
					type: 'highlight',
					data: { hName: 'mark' },
					children: [{ type: 'text', value: 'b' }]
				},
				{ type: 'text', value: ' c' }
			]
		})
	})

	it('should return normal when when syntax invalid', () => {
		const testcase = ['a===b', '===a===', '== a ==']

		for (const str of testcase) {
			const node = parser.parse(str)
			expect(node.children).toHaveLength(1)
			expect(node.children[0].type).toBe('paragraph')

			const text = (node.children[0] as Paragraph).children[0] as Text
			expect(text.value).toBe(str)
		}
	})
})
