import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { htmlFlow } from '../../src/extensions/html-flow'
import { addMicromarkExtensions } from '../../src/extensions/index'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, htmlFlow)
	})

describe('html flow extension', async () => {
	describe('type 1 - raw', () => {
		it('should return script tag', async () => {
			const node = parser.parse('<script type="module">\n\nlet data = $state<string>(\"10\")\n\n</script>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<script type="module">\n\nlet data = $state<string>("10")\n\n</script>'
			})
		})

		it('should return script tag outside paragraph when interrupt', async () => {
			const node = parser.parse('decko\n<pre {@attach myAttachment}>\n\nlet data = $state("10")\n\n</pre>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<pre {@attach myAttachment}>\n\nlet data = $state("10")\n\n</pre>'
			})
		})

		it('should return script tag outside blockquote when interrupt and lazy', async () => {
			const node = parser.parse('> decko\n<pre {@attach myAttachment}>\n\nlet data = $state("10")\n\n</pre>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<pre {@attach myAttachment}>\n\nlet data = $state("10")\n\n</pre>'
			})
		})
	})

	describe('type 2 - comment', () => {
		it('should return comment tag', async () => {
			const node = parser.parse('<!-- \n\ncomment\n\n -->')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<!-- \n\ncomment\n\n -->'
			})
		})

		it('should return comment tag outside paragraph when interrupt', async () => {
			const node = parser.parse('decko\n<!-- \n\ncomment\n\n -->')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<!-- \n\ncomment\n\n -->'
			})
		})

		it('should return comment tag outside blockquote when interrupt and lazy', async () => {
			const node = parser.parse('> decko\n<!-- \n\ncomment\n\n -->')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<!-- \n\ncomment\n\n -->'
			})
		})

		it('should return comment tag with more dash', async () => {
			const node = parser.parse('<!-- comment-comment --->')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<!-- comment-comment --->'
			})
		})
	})

	describe('type 3 - processing instructions', () => {
		it('should return processing instructions tag', async () => {
			const node = parser.parse('<?start name="placeholder">\nLoading...\n<?end>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<?start name="placeholder">\nLoading...\n<?end>'
			})
		})

		it('should return processing instructions tag outside paragraph when interrupt', async () => {
			const node = parser.parse('decko\n<?start name="placeholder">\nLoading...\n<?end>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<?start name="placeholder">\nLoading...\n<?end>'
			})
		})

		it('should return processing instructions tag outside blockquote when interrupt and lazy', async () => {
			const node = parser.parse('> decko\n<?start name="placeholder">\nLoading...\n<?end>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<?start name="placeholder">\nLoading...\n<?end>'
			})
		})
	})

	describe('type 4 - declarations', () => {
		it('should return declarations tag', async () => {
			const node = parser.parse(
				'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN>" "http://www.w3.org/TR/html4/loose.dtd">'
			)

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN>" "http://www.w3.org/TR/html4/loose.dtd">'
			})
		})

		it('should return processing instructions tag outside paragraph when interrupt', async () => {
			const node = parser.parse(
				'decko\n<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN>" "http://www.w3.org/TR/html4/loose.dtd">'
			)

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN>" "http://www.w3.org/TR/html4/loose.dtd">'
			})
		})

		it('should return processing instructions tag outside blockquote when interrupt and lazy', async () => {
			const node = parser.parse(
				'> decko\n<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN>" "http://www.w3.org/TR/html4/loose.dtd">'
			)

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN>" "http://www.w3.org/TR/html4/loose.dtd">'
			})
		})
	})

	describe('type 5 - cdata', () => {
		it('should return cdata tag', async () => {
			const node = parser.parse(
				'<![CDATA[\n<messages> Hope </messages>\n]]>\n<![CDATA[\n<message> Welcome </message>\n]]>'
			)

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<![CDATA[\n<messages> Hope </messages>\n]]>'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<![CDATA[\n<message> Welcome </message>\n]]>'
			})
		})

		it('should return processing instructions tag outside paragraph when interupt', async () => {
			const node = parser.parse(
				'decko\n<![CDATA[\n<messages> Hope </messages>\n]]>\n<![CDATA[\n<message> Welcome </message>\n]]>'
			)

			expect(node.children).toHaveLength(3)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<![CDATA[\n<messages> Hope </messages>\n]]>'
			})

			expect(node.children[2]).toMatchObject({
				type: 'html',
				value: '<![CDATA[\n<message> Welcome </message>\n]]>'
			})
		})

		it('should return processing instructions tag outside blockquote when interrupt and lazy', async () => {
			const node = parser.parse(
				'> decko\n<![CDATA[\n<messages> Hope </messages>\n]]>\n<![CDATA[\n<message> Welcome </message>\n]]>'
			)

			expect(node.children).toHaveLength(3)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<![CDATA[\n<messages> Hope </messages>\n]]>'
			})
			expect(node.children[2]).toMatchObject({
				type: 'html',
				value: '<![CDATA[\n<message> Welcome </message>\n]]>'
			})
		})

		it('should return cdata tag with more right square bracket', async () => {
			const node = parser.parse('<![CDATA[ ] ]]>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<![CDATA[ ] ]]>'
			})
		})
	})

	describe('type 6 - basic', () => {
		it('should return basic tag', async () => {
			const node = parser.parse('<div>\ndecko\n</div>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<div>\ndecko\n</div>'
			})
		})

		it('should return closing tag with more space', async () => {
			const node = parser.parse('</div   >')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '</div   >'
			})
		})

		it('should return basic tag with svelte syntax', async () => {
			const node = parser.parse('<div transition:fade {@attach myAttachment}>...</div>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<div transition:fade {@attach myAttachment}>...</div>'
			})
		})

		it('should return complete basic tag', async () => {
			const node = parser.parse('<div/> after will be consume')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<div/> after will be consume'
			})
		})

		it('should return basic tag and paragraph when have more 2 blank line', async () => {
			const node = parser.parse('<div>\n\ndecko\n</div>')

			expect(node.children).toHaveLength(3)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<div>'
			})
			expect(node.children[1]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[2]).toMatchObject({
				type: 'html',
				value: '</div>'
			})
		})

		it('should return basic tag outside paragraph when interrupt', async () => {
			const node = parser.parse('decko\n<div>decko</div>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<div>decko</div>'
			})
		})

		it('should return basic tag outside blockquote when interrupt but and lazy', async () => {
			const node = parser.parse('> decko\n<div>decko</div>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote'
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<div>decko</div>'
			})
		})
	})

	describe('type 6 - completed (span, component)', () => {
		it('should return completed tag', async () => {
			const node = parser.parse('<Component>\ndecko\n<Component>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<Component>\ndecko\n<Component>'
			})
		})

		it('should return complete completed tag', async () => {
			const node = parser.parse('<Component/> after will be consume')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<Component/> after will be consume'
			})
		})

		it('should return completed tag and paragraph when have more 2 blank line', async () => {
			const node = parser.parse('<Component>\n\ndecko\n\n</Component>')

			expect(node.children).toHaveLength(3)
			expect(node.children[0]).toMatchObject({
				type: 'html',
				value: '<Component>'
			})
			expect(node.children[1]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: 'decko' }]
			})
			expect(node.children[2]).toMatchObject({
				type: 'html',
				value: '</Component>'
			})
		})

		it('should return inline completed tag inside paragraph when interrupt and not lazy', async () => {
			const node = parser.parse('decko\n<Component>decko</Component>')

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [
					{ type: 'text', value: 'decko\n' },
					{ type: 'html', value: '<Component>' },
					{ type: 'text', value: 'decko' },
					{ type: 'html', value: '</Component>' }
				]
			})
		})

		it('should return inline completed tag outside blockquote when interrupt and lazy', async () => {
			const node = parser.parse('> decko\n<Component>decko</Component>')

			expect(node.children).toHaveLength(2)
			expect(node.children[0]).toMatchObject({
				type: 'blockquote',
				children: [
					{
						type: 'paragraph',
						children: [{ type: 'text', value: 'decko' }]
					}
				]
			})
			expect(node.children[1]).toMatchObject({
				type: 'html',
				value: '<Component>decko</Component>'
			})
		})
	})

	it('should return paragraph when invalid syntax', () => {
		const testcase = ['<!9', '<!- ', '<![CD ', '<@', '<d@', '<div/@']

		for (const str of testcase) {
			const node = parser.parse(str)

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: str.trim() }]
			})
		}
	})
})
