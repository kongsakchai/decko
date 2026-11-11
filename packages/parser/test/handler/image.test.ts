import markdown from 'remark-parse'
import remark2Rehype from 'remark-rehype'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { imageHandler } from '../../src/handler/image'

describe('rehype image handle', async () => {
	it('should return raw src when src inside curly brace', async () => {
		const parser = unified()
			.use(markdown)
			.use(remark2Rehype, {
				allowDangerousHtml: true,
				handlers: { image: imageHandler }
			})

		const str = '![img]({img})'
		const node = parser.parse(str)
		const hast = await parser.run(node)

		expect(hast.children[0]).toMatchObject({
			type: 'element',
			tagName: 'p',
			children: [
				{
					type: 'element',
					tagName: 'img',
					properties: {
						src: '{img}'
					}
				}
			]
		})
	})

	it('should return url when src is url', async () => {
		const parser = unified()
			.use(markdown)
			.use(remark2Rehype, {
				allowDangerousHtml: true,
				handlers: { image: imageHandler }
			})

		const str = '![img](./img.jpg)'
		const node = parser.parse(str)
		const hast = await parser.run(node)

		expect(hast.children[0]).toMatchObject({
			type: 'element',
			tagName: 'p',
			children: [
				{
					type: 'element',
					tagName: 'img',
					properties: {
						src: './img.jpg'
					}
				}
			]
		})
	})

	it('should return encoded src when not set image handler', async () => {
		const parser = unified().use(markdown).use(remark2Rehype, {
			allowDangerousHtml: true
		})

		const str = '![img]({img})'
		const node = parser.parse(str)
		const hast = await parser.run(node)

		expect(hast.children[0]).toMatchObject({
			type: 'element',
			tagName: 'p',
			children: [
				{
					type: 'element',
					tagName: 'img',
					properties: {
						src: '%7Bimg%7D'
					}
				}
			]
		})
	})
})
