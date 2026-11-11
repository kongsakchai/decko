import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'

import { addMicromarkExtensions } from '../../src/extensions/index'
import { svelteBlock } from '../../src/extensions/svelte-block'

const parser = unified()
	.use(markdown)
	.use(function (this) {
		addMicromarkExtensions(this, svelteBlock)
	})

describe('svelte block extension', async () => {
	it('should return if block', async () => {
		const node = parser.parse('{#if msg=="decko"}\ndecko\n{/if}')

		expect(node.children).toHaveLength(3)
		expect(node.children[0]).toMatchObject({
			type: 'html',
			value: '{#if msg=="decko"}'
		})
		expect(node.children[1]).toMatchObject({
			type: 'paragraph',
			children: [{ type: 'text', value: 'decko' }]
		})
		expect(node.children[2]).toMatchObject({
			type: 'html',
			value: '{/if}'
		})
	})

	it('should return await block ', async () => {
		const node = parser.parse('{@html html}')

		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({
			type: 'html',
			value: '{@html html}'
		})
	})

	it('should return if block inline ', async () => {
		const node = parser.parse('{#if msg=="decko"}data{/if}')

		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({
			type: 'html',
			value: '{#if msg=="decko"}data{/if}'
		})
	})

	it('should return if block multiple expression', async () => {
		const node = parser.parse('{#if \nmsg\n\n==\n\n"decko"\n}data{/if}')

		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({
			type: 'html',
			value: '{#if \nmsg\n\n==\n\n"decko"\n}data{/if}'
		})
	})

	it('should return if block outside paragraph when interupt', async () => {
		const node = parser.parse('decko\n{#if \nmsg\n\n==\n\n"decko"\n}data{/if}')

		expect(node.children).toHaveLength(2)
		expect(node.children[1]).toMatchObject({
			type: 'html',
			value: '{#if \nmsg\n\n==\n\n"decko"\n}data{/if}'
		})
	})

	it('should return if block when the expression has multiple statements and contains a closing brace `}`', async () => {
		const node = parser.parse('{#if \nfetch({})\n==\n"decko"\n}data{/if}')

		expect(node.children).toHaveLength(1)
		expect(node.children[0]).toMatchObject({
			type: 'html',
			value: '{#if \nfetch({})\n==\n"decko"\n}data{/if}'
		})
	})

	it('should return paragraph when invalid syntax', async () => {
		const testcase = ['{#if ', '{#jack}', '{#1f', '{', '{$']

		for (const t of testcase) {
			const node = parser.parse(t)

			expect(node.children).toHaveLength(1)
			expect(node.children[0]).toMatchObject({
				type: 'paragraph',
				children: [{ type: 'text', value: t.trim() }]
			})
		}
	})
})
