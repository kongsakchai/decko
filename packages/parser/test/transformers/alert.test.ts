import { VFile } from 'vfile'
import { describe, expect, it } from 'vitest'

import { alertTransformer } from '../../src/transformers/alert'
import { SlideContext } from '../../src/types'

function createContext(): SlideContext {
	return {
		slides: [{ breakIndex: 0, global: {} }],
		style: [],
		script: [],
		extra: {}
	}
}

describe('alert transformer', () => {
	it('should convert blockquote with alert marker', async () => {
		const context = createContext()
		const node: any = {
			type: 'root',
			children: [
				{
					type: 'blockquote',
					children: [
						{ type: 'paragraph', children: [{ type: 'text', value: '[!NOTE]\nBody text' }] }
					]
				},
				{
					type: 'blockquote',
					children: [
						{ type: 'paragraph', children: [{ type: 'text', value: '[!WARNING]\nCareful' }] }
					]
				}
			]
		}

		const vfile = new VFile({ context })

		const transform = alertTransformer()
		await transform(node, vfile, () => {})

		const note = node.children[0]
		expect(note.data.hProperties).toEqual({ alert: 'note' })
		expect(note.children).toHaveLength(2)
		expect(note.children[0]).toMatchObject({
			type: 'paragraph',
			data: {
				hProperties: {
					style: 'display:flex; gap:8px; align-items:center;',
					class: 'alert-title'
				}
			},
			children: [
				{ type: 'html' },
				{ type: 'text', value: 'Note' }
			]
		})
		expect(note.children[0].children[0].value).toContain('<svg')
		expect(note.children[1].children[0].value).toBe('\nBody text')

		expect(node.children[1].data.hProperties).toEqual({ alert: 'warning' })
	})

	it('should use custom alert, title override and keep existing data', async () => {
		const context = createContext()
		const node: any = {
			type: 'root',
			children: [
				{
					type: 'blockquote',
					data: { hProperties: { class: 'quote' } },
					children: [
						{ type: 'paragraph', children: [{ type: 'text', value: '[!custom]Hello' }] }
					]
				}
			]
		}

		const vfile = new VFile({ context })

		const transform = alertTransformer({ customAlerts: { custom: { title: 'Custom Title' } } })
		await transform(node, vfile, () => {})

		const quote = node.children[0]
		expect(quote.data.hProperties).toEqual({ class: 'quote', alert: 'custom' })
		expect(quote.children[0].children[0]).toEqual({ type: 'html', value: '' })
		expect(quote.children[0].children[1]).toEqual({ type: 'text', value: 'Hello' })
	})

	it('should ignore blockquote without alert marker', async () => {
		const context = createContext()
		const node: any = {
			type: 'root',
			children: [
				{ type: 'blockquote', children: [] },
				{ type: 'blockquote', children: [{ type: 'heading', depth: 1, children: [] }] },
				{ type: 'blockquote', children: [{ type: 'paragraph', children: [] }] },
				{
					type: 'blockquote',
					children: [
						{ type: 'paragraph', children: [{ type: 'emphasis', children: [] }] }
					]
				},
				{
					type: 'blockquote',
					children: [{ type: 'paragraph', children: [{ type: 'text', value: 'plain quote' }] }]
				},
				{
					type: 'blockquote',
					children: [
						{ type: 'paragraph', children: [{ type: 'text', value: '[!unknown] body' }] }
					]
				}
			]
		}

		const vfile = new VFile({ context })

		const transform = alertTransformer()
		await transform(node, vfile, () => {})

		expect(node.children.map((blockquote: any) => blockquote.children.length)).toEqual([
			0, 1, 1, 1, 1, 1
		])
		for (const blockquote of node.children as any[]) {
			expect(blockquote.data).toBeUndefined()
		}
		expect(node.children[4].children[0].children[0].value).toBe('plain quote')
		expect(node.children[5].children[0].children[0].value).toBe('[!unknown] body')
	})

	it('should ignore when tree is the blockquote itself', async () => {
		const context = createContext()
		const node: any = {
			type: 'blockquote',
			children: [{ type: 'paragraph', children: [{ type: 'text', value: '[!NOTE]\nBody' }] }]
		}

		const vfile = new VFile({ context })

		const transform = alertTransformer()
		await transform(node, vfile, () => {})

		expect(node.children).toHaveLength(1)
		expect(node).not.toHaveProperty('data')
		expect(node.children[0].children[0].value).toBe('[!NOTE]\nBody')
	})
})