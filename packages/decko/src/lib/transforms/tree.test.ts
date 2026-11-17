/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Directive } from '@deckomd/parser'

import { describe, expect, it } from 'vitest'

import { hoistExtension } from './tree.js'

function createContext(node: any, attrs: Directive = {}, parents: any[] = []) {
	return {
		node,
		attrs,
		parents,
		root: { type: 'root', children: parents[0]?.children ?? [] },
		slideCtx: { slides: [{ breakIndex: 0 }], style: [], script: [], extra: {} },
		currentSlide: { breakIndex: 0 }
	} as any
}

describe('hoistExtension.when', () => {
	it('should match background attributes', () => {
		expect(hoistExtension.when(createContext({}, { bg: 'red' }))).toBe(true)
		expect(hoistExtension.when(createContext({}, { bg: 0 }))).toBe(true)
		expect(hoistExtension.when(createContext({}, { bg: null }))).toBe(false)
		expect(hoistExtension.when(createContext({}, {}))).toBe(false)
	})

	it('should match absolute classes and styles', () => {
		expect(hoistExtension.when(createContext({}, { class: 'absolute top-0' }))).toBe(true)
		expect(hoistExtension.when(createContext({}, { class: 'relative' }))).toBe(false)
		expect(hoistExtension.when(createContext({}, { class: ['absolute'] }))).toBe(false)
		expect(hoistExtension.when(createContext({}, { style: 'position:absolute' }))).toBe(true)
		expect(hoistExtension.when(createContext({}, { style: 'color:red' }))).toBe(false)
	})
})

describe('hoistExtension.extension', () => {
	it('should hoist a node to its grandparent', () => {
		const node = { type: 'paragraph', children: [] }
		const sibling = { type: 'text', value: 'sibling' }
		const parent = { type: 'blockquote', children: [node, sibling] }
		const grand = { type: 'root', children: [parent] }
		const ctx = createContext(node, {}, [grand, parent])

		hoistExtension.extension(ctx)

		expect(parent.children).toEqual([sibling])
		expect(grand.children).toEqual([node, parent])
	})

	it('should remove an empty parent', () => {
		const node = { type: 'paragraph', children: [] }
		const parent = { type: 'blockquote', children: [node] }
		const grand = { type: 'root', children: [parent] }
		const ctx = createContext(node, {}, [grand, parent])

		hoistExtension.extension(ctx)

		expect(parent.children).toEqual([])
		expect(grand.children).toEqual([node])
	})

	it('should do nothing when there are not enough parents', () => {
		const node = { type: 'paragraph', children: [] }
		const parent = { type: 'blockquote', children: [node] }

		hoistExtension.extension(createContext(node, {}, [parent]))

		expect(parent.children).toEqual([node])
	})

	it('should do nothing when the node is not in its parent', () => {
		const node = { type: 'paragraph', children: [] }
		const parent = { type: 'blockquote', children: [] }
		const grand = { type: 'root', children: [parent] }

		hoistExtension.extension(createContext(node, {}, [grand, parent]))

		expect(parent.children).toEqual([])
		expect(grand.children).toEqual([parent])
	})

	it('should do nothing when the parent is not in the grandparent', () => {
		const node = { type: 'paragraph', children: [] }
		const parent = { type: 'blockquote', children: [node] }
		const grand = { type: 'root', children: [] }

		hoistExtension.extension(createContext(node, {}, [grand, parent]))

		expect(parent.children).toEqual([node])
		expect(grand.children).toEqual([])
	})
})
