import type { Directive } from '@deckomd/parser'

import { describe, expect, it } from 'vitest'

import { assetsLinkExtension, getAssetImports } from './assets.js'

function createContext(node: any, extra: Directive = {}) {
	const slideCtx = {
		slides: [{ breakIndex: 0 }],
		style: [],
		script: [],
		extra
	}

	return {
		root: { type: 'root', children: [] },
		node,
		parents: [],
		attrs: {},
		slideCtx,
		currentSlide: slideCtx.slides[0]
	} as any
}

describe('assetsLinkExtension', () => {
	it('should resolve image assets', () => {
		const extra: Directive = {}
		const ctx = createContext({ type: 'image', url: 'image.png' }, extra)

		assetsLinkExtension(ctx)

		expect(ctx.node.url).toBe('{__assets0}')
		expect(extra.assets).toEqual({ 'image.png': '__assets0' })
		expect(extra.assetCounter).toBe(1)
	})

	it('should reuse existing assets', () => {
		const extra: Directive = { assets: { 'image.png': '__assets0' }, assetCounter: 1 }
		const ctx = createContext({ type: 'link', url: 'image.png' }, extra)

		assetsLinkExtension(ctx)

		expect(ctx.node.url).toBe('{__assets0}')
		expect(extra.assetCounter).toBe(1)
	})

	it('should keep external, empty and markdown urls', () => {
		const extra: Directive = {}
		const urls = [
			'',
			'https://example.com/a.png',
			'http://example.com/a.png',
			'//example.com/a.png',
			'readme.md',
			'mailto:someone@example.com'
		]

		for (const url of urls) {
			const ctx = createContext({ type: 'link', url }, extra)
			assetsLinkExtension(ctx)
			expect(ctx.node.url).toBe(url)
		}

		expect(extra.assetCounter).toBe(0)
		expect(extra.assets).toEqual({})
	})

	it('should resolve assets in html src attributes', () => {
		const extra: Directive = {}
		const ctx = createContext({ type: 'html', value: '<img src="image.png" alt="image" />' }, extra)

		assetsLinkExtension(ctx)

		expect(ctx.node.value).toBe('<img src="{__assets0}" alt="image" />')
		expect(extra.assetCounter).toBe(1)
	})

	it('should resolve assets in html href attributes', () => {
		const extra: Directive = {}
		const ctx = createContext({ type: 'html', value: '<a href="file.pdf">file</a>' }, extra)

		assetsLinkExtension(ctx)

		expect(ctx.node.value).toBe('<a href="{__assets0}">file</a>')
		expect(extra.assetCounter).toBe(1)
	})

	it('should ignore unrelated html nodes', () => {
		const extra: Directive = {}
		const ctx = createContext({ type: 'html', value: '<div>content</div>' }, extra)

		assetsLinkExtension(ctx)

		expect(ctx.node.value).toBe('<div>content</div>')
		expect(extra.assets).toEqual({})
	})

	it('should ignore unsupported nodes', () => {
		const extra: Directive = {}
		const ctx = createContext({ type: 'paragraph', children: [] }, extra)

		assetsLinkExtension(ctx)

		expect(ctx.node).toEqual({ type: 'paragraph', children: [] })
		expect(extra.assets).toEqual({})
	})
})

describe('getAssetImports', () => {
	it('should create import statements', () => {
		expect(
			getAssetImports({
				assets: {
					'image.png': 'image',
					'file.pdf': 'file'
				}
			})
		).toEqual(['import image from "image.png"', 'import file from "file.pdf"'])
	})

	it('should return empty array when assets are invalid', () => {
		expect(getAssetImports({})).toEqual([])
		expect(getAssetImports({ assets: null })).toEqual([])
		expect(getAssetImports({ assets: [] })).toEqual([])
		expect(getAssetImports({ assets: 'image.png' })).toEqual([])
	})

	it('should throw for invalid asset variable names', () => {
		expect(() => getAssetImports({ assets: { 'image.png': 'not-valid' } })).toThrow(
			'Invalid asset variable name "not-valid" for "image.png"'
		)
		expect(() => getAssetImports({ assets: { 'image.png': 10 } })).toThrow(
			'Invalid asset variable name "10" for "image.png"'
		)
	})
})
