import { Paragraph } from 'mdast'
import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { attributeFromMarkdown } from '../../src/extensions/attribute'
import { attributeBlock, attributeBlockFromMarkdown } from '../../src/extensions/attribute-block'
import { addFromMarkdownExtensions, addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, attributeBlock)
		addFromMarkdownExtensions(this, attributeBlockFromMarkdown, attributeFromMarkdown)
	})

describe('attribute block extension', async () => {
	it('should return attribute block mdast', async () => {
		const expected = {
			disable: true,
			title: 'decko',
			data: true,
			class: ['class-1', 'class-2'],
			id: ['id-1', 'id-2'],
			onclick: '{onclick}',
			svelteExpression: ['{...props}']
		}

		const node = parser.parse(
			'attr @{ disable data= _invalid .class-1 .class-2 #id-1 #id-2 title=decko onclick="{onclick}" {...props} }'
		)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.data).toEqual({
			hProperties: expected
		})
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: 'attr '
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'attributeBlock',
			attr: expected
		})
	})

	it('should return empty when attribute empty', async () => {
		const node = parser.parse('attr @{}')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.data).toEqual({
			hProperties: {}
		})
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: 'attr '
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'attributeBlock',
			attr: undefined
		})
	})

	it('should return empty when key invalid', async () => {
		const node = parser.parse('attr @{ @data={data}}')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.data).toEqual({
			hProperties: {}
		})
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: 'attr '
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'attributeBlock',
			attr: {}
		})
	})

	it('should return undefined when syntax invalid', async () => {
		const testcase = ['decko @', 'decko @{', 'decko @{} decko']

		for (const str of testcase) {
			const node = parser.parse(str)

			const paragraph = node.children[0] as Paragraph
			expect(paragraph.children).toHaveLength(1)
			expect(paragraph.children[0]).toMatchObject({
				type: 'text',
				value: str
			})
		}
	})

	it('should return attribute with multiple line', async () => {
		const expected = {
			title: 'decko\ndecko',
			class: ['class-1', 'class-2']
		}

		const node = parser.parse('attr @{ title="decko\ndecko"\n.class-1\n.class-2 }')

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.data).toEqual({
			hProperties: expected
		})
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: 'attr '
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'attributeBlock',
			attr: expected
		})
	})

	it('should return attribute with scope value', async () => {
		const expected = {
			case1: '{a + c}',
			case2: `\\"a\\"`,
			case3: '`${click}`',
			case4: '[]'
		}

		const node = parser.parse(`attr @{  case1={a + c} case2="\\"a\\"" case3=\`\${click}\` case4=[] }`)

		const paragraph = node.children[0] as Paragraph
		expect(paragraph.children).toHaveLength(2)
		expect(paragraph.data).toEqual({
			hProperties: expected
		})
		expect(paragraph.children[0]).toMatchObject({
			type: 'text',
			value: 'attr '
		})
		expect(paragraph.children[1]).toMatchObject({
			type: 'attributeBlock',
			attr: expected
		})
	})
})
