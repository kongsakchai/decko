import type { Directive } from '@deckomd/parser'

import { describe, expect, it } from 'vitest'

import { stepExtension } from './step.js'

function createContext(attrs: Directive, local?: Directive) {
	const currentSlide: Directive = local ? { local } : {}

	return {
		node: { type: 'paragraph' },
		attrs,
		currentSlide,
		root: { type: 'root', children: [] },
		parents: [],
		slideCtx: { slides: [{ breakIndex: 0 }], style: [], script: [], extra: {} }
	} as any
}

describe('stepExtension', () => {
	it('should do nothing when there are no step attributes', () => {
		const ctx = createContext({ step: 2, class: 'box' })

		stepExtension(ctx)

		expect(ctx.attrs.svelteExpression).toBeUndefined()
		expect(ctx.currentSlide.local).toBeUndefined()
	})

	it('should add step classes and create the attachment', () => {
		const ctx = createContext({ 'step-1': 'active visible' })

		stepExtension(ctx)

		expect(ctx.currentSlide.local).toEqual({ step: 1 })
		expect(ctx.attrs.svelteExpression).toEqual([
			'{@attach stepper(page,[[1,[{"action":"add","class":["active","visible"]}]]])}'
		])
	})

	it('should add and remove classes with step ranges', () => {
		const ctx = createContext({ 'step-1-3': 'active' })

		stepExtension(ctx)

		expect(ctx.currentSlide.local).toEqual({ step: 3 })
		expect(ctx.attrs.svelteExpression).toEqual([
			'{@attach stepper(page,[[1,[{"action":"add","class":["active"]}]],[3,[{"action":"remove","class":["active"]}]]])}'
		])
	})

	it('should keep the highest step from attributes and local state', () => {
		const ctx = createContext({ step: 5, 'step-1': 'active' }, { step: 7 })

		stepExtension(ctx)

		expect(ctx.currentSlide.local).toEqual({ step: 7 })
	})

	it('should append to existing svelte expressions', () => {
		const ctx = createContext({ 'step-2': 'active' })
		ctx.attrs.svelteExpression = ['existing']

		stepExtension(ctx)

		expect(ctx.attrs.svelteExpression).toHaveLength(2)
		expect(ctx.attrs.svelteExpression[0]).toBe('existing')
		expect(ctx.attrs.svelteExpression[1]).toBe(
			'{@attach stepper(page,[[2,[{"action":"add","class":["active"]}]]])}'
		)
	})

	it('should ignore invalid step attributes', () => {
		const ctx = createContext({
			step: '2',
			'step-1': 10,
			'step-2': ' ',
			'step-3': 'active',
			'not-a-step': 'active'
		})

		stepExtension(ctx)

		expect(ctx.currentSlide.local).toEqual({ step: 3 })
		expect(ctx.attrs.svelteExpression).toEqual([
			'{@attach stepper(page,[[3,[{"action":"add","class":["active"]}]]])}'
		])
	})

	it('should combine actions for the same step', () => {
		const ctx = createContext({ 'step-1': 'a', 'step-1-1': 'b' })

		stepExtension(ctx)

		expect(ctx.attrs.svelteExpression).toEqual([
			'{@attach stepper(page,[[1,[{"action":"add","class":["a"]},{"action":"add","class":["b"]},{"action":"remove","class":["b"]}]]])}'
		])
	})
})
