import { describe, expect, it, vi } from 'vitest'

import type { SlideContext } from './slide.svelte.js'
import { Action, createSlideContext } from './slide.svelte.js'

const mocks = vi.hoisted(() => ({
	context: undefined as unknown
}))

vi.mock('svelte', () => ({
	createContext: () => [
		() => mocks.context,
		(value: unknown) => {
			mocks.context = value
			return value
		}
	]
}))

function createSlide() {
	return {
		title: 'Test',
		pages: [{ page: 1, step: 2 }, { page: 2, step: 4 }, { page: 3 }]
	}
}

function createContext(): SlideContext {
	return createSlideContext(createSlide())
}

describe('createSlideContext', () => {
	it('should create a context with default values', () => {
		const ctx = createContext()

		expect(ctx.slide.title).toBe('Test')
		expect(ctx.page).toBe(1)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.NEXT)
		expect(ctx.totalPage).toBe(3)
		expect(ctx.maxStep).toBe(2)
	})

	it('should return the step of a page', () => {
		const ctx = createContext()

		expect(ctx.pageStep()).toBe(2)
		expect(ctx.pageStep(2)).toBe(4)
		expect(ctx.pageStep(3)).toBe(0)
		expect(ctx.pageStep(0)).toBe(0)
		expect(ctx.pageStep(4)).toBe(0)
	})

	it('should clamp values and set the action on goto', () => {
		const ctx = createContext()

		ctx.goto(2, 4)
		ctx.goto(0, -1)
		expect(ctx.page).toBe(1)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.JUMP)

		ctx.goto(2, 99, Action.NEXT)
		expect(ctx.page).toBe(2)
		expect(ctx.step).toBe(4)
		expect(ctx.action).toBe(Action.NEXT)

		ctx.goto(99, 99, Action.PREVIOUS)
		expect(ctx.page).toBe(3)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.PREVIOUS)
	})

	it('should not change when goto receives the current page and step', () => {
		const ctx = createContext()

		ctx.goto(2, 4, Action.NEXT)
		ctx.goto(2, 4, Action.PREVIOUS)

		expect(ctx.page).toBe(2)
		expect(ctx.step).toBe(4)
		expect(ctx.action).toBe(Action.NEXT)
	})

	it('should use default step and action on goto', () => {
		const ctx = createContext()

		ctx.goto(2)

		expect(ctx.page).toBe(2)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.JUMP)
	})

	it('should move to the next step and page', () => {
		const ctx = createContext()

		ctx.next()
		expect(ctx.page).toBe(1)
		expect(ctx.step).toBe(1)
		expect(ctx.action).toBe(Action.NEXT)

		ctx.next()
		expect(ctx.page).toBe(1)
		expect(ctx.step).toBe(2)
		expect(ctx.action).toBe(Action.NEXT)

		ctx.next()
		expect(ctx.page).toBe(2)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.NEXT_PAGE)
	})

	it('should not move next from the last page', () => {
		const ctx = createContext()

		ctx.goto(3, 0)
		ctx.next()

		expect(ctx.page).toBe(3)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.JUMP)
	})

	it('should move to the previous step and page', () => {
		const ctx = createContext()

		ctx.goto(3, 0)
		ctx.previous()
		expect(ctx.page).toBe(2)
		expect(ctx.step).toBe(4)
		expect(ctx.action).toBe(Action.PREV_PAGE)

		ctx.previous()
		expect(ctx.page).toBe(2)
		expect(ctx.step).toBe(3)
		expect(ctx.action).toBe(Action.PREVIOUS)
	})

	it('should not move previous from the first page', () => {
		const ctx = createContext()

		ctx.previous()

		expect(ctx.page).toBe(1)
		expect(ctx.step).toBe(0)
		expect(ctx.action).toBe(Action.NEXT)
	})
})
