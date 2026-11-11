import markdown from 'remark-parse'
import remark2Rehype from 'remark-rehype'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { linkHandler } from '../../src/handler/link'

describe('rehype image handle', async () => {
	it('should return raw href when href inside curly brace', async () => {
		const parser = unified()
			.use(markdown)
			.use(remark2Rehype, {
				allowDangerousHtml: true,
				handlers: { link: linkHandler }
			})

		const str = '[link]({link})'
		const node = parser.parse(str)
		const hast = await parser.run(node)

		expect(hast.children[0]).toMatchObject({
			type: 'element',
			tagName: 'p',
			children: [
				{
					type: 'element',
					tagName: 'a',
					properties: {
						href: '{link}'
					}
				}
			]
		})
	})

	it('should return url when href is url', async () => {
		const parser = unified()
			.use(markdown)
			.use(remark2Rehype, {
				allowDangerousHtml: true,
				handlers: { link: linkHandler }
			})

		const str = '[link](./download)'
		const node = parser.parse(str)
		const hast = await parser.run(node)

		expect(hast.children[0]).toMatchObject({
			type: 'element',
			tagName: 'p',
			children: [
				{
					type: 'element',
					tagName: 'a',
					properties: {
						href: './download'
					}
				}
			]
		})
	})

	it('should return encoded href when not set link handler', async () => {
		const parser = unified().use(markdown).use(remark2Rehype, {
			allowDangerousHtml: true
		})

		const str = '[link]({link})'
		const node = parser.parse(str)
		const hast = await parser.run(node)

		expect(hast.children[0]).toMatchObject({
			type: 'element',
			tagName: 'p',
			children: [
				{
					type: 'element',
					tagName: 'a',
					properties: {
						href: '%7Blink%7D'
					}
				}
			]
		})
	})
})
