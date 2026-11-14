import type { Directive } from '@deckomd/parser'

import { describe, expect, it } from 'vitest'

import { splitContainerExtension, toSplitStyles } from './split.js'

function createContext(node: any, attrs: Directive = {}) {
	return {
		node,
		attrs,
		root: { type: 'root', children: [] },
		parents: [],
		slideCtx: { slides: [{ breakIndex: 0 }], style: [], script: [], extra: {} },
		currentSlide: { breakIndex: 0 }
	} as any
}

describe('toSplitStyles', () => {
	it('should convert numeric split', () => {
		expect(toSplitStyles({ split: 2 })).toBe('--split-col: repeat(2,1fr)')
	})

	it('should convert string split', () => {
		expect(toSplitStyles({ split: '2' })).toBe('--split-col: repeat(2,1fr)')
		expect(toSplitStyles({ split: '1 2 auto' })).toBe('--split-col: 1fr 2fr auto')
	})

	it('should convert column and row split', () => {
		expect(toSplitStyles({ split: '1fr, 2fr' })).toBe('--split-col: 1fr; --split-row: 2fr')
		expect(toSplitStyles({ split: ', 1fr' })).toBe('--split-row: 1fr')
		expect(toSplitStyles({ split: '1fr, ' })).toBe('--split-col: 1fr')
	})

	it('should merge existing style and gap', () => {
		expect(toSplitStyles({ split: 2, style: 'color:red', 'split-gap': '8px' })).toBe(
			'color:red; --split-col: repeat(2,1fr); gap: 8px'
		)
		expect(toSplitStyles({ split: ' ', 'split-gap': '8px' })).toBe('gap: 8px')
	})

	it('should return undefined when split is missing or empty', () => {
		expect(toSplitStyles({})).toBeUndefined()
		expect(toSplitStyles({ split: ' ' })).toBeUndefined()
		expect(toSplitStyles({ split: 0, style: 'color:red' })).toBe('color:red; --split-col: repeat(0,1fr)')
	})
})

describe('splitContainerExtension', () => {
	it('should add split styles to containers', () => {
		const ctx = createContext({ type: 'container' }, { split: 2, style: 'color:red', 'split-gap': '8px' })

		splitContainerExtension(ctx)

		expect(ctx.attrs.style).toBe('color:red; --split-col: repeat(2,1fr); gap: 8px; color:red')
		expect(ctx.attrs).not.toHaveProperty('split')
	})

	it('should ignore non-container nodes', () => {
		const ctx = createContext({ type: 'paragraph' }, { split: 2 })

		splitContainerExtension(ctx)

		expect(ctx.attrs).toEqual({ split: 2 })
	})

	it('should ignore containers without split', () => {
		const ctx = createContext({ type: 'container' }, {})

		splitContainerExtension(ctx)

		expect(ctx.attrs).toEqual({})
	})

	it('should ignore empty split values', () => {
		const ctx = createContext({ type: 'container' }, { split: ' ' })

		splitContainerExtension(ctx)

		expect(ctx.attrs).toEqual({ split: ' ' })
	})
})
