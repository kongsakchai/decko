import { describe, expect, it, vi } from 'vitest'

import { createViewContext } from './view.svelte.js'

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

describe('createViewContext', () => {
	it('should create a context with default values', () => {
		const ctx = createViewContext()

		expect(ctx).toMatchObject({
			width: 1280,
			height: 720,
			viewportWidth: 1280,
			viewportHeight: 720,
			zoom: 1
		})
		expect(ctx.scale).toBe(1)
	})

	it('should use provided values', () => {
		const ctx = createViewContext({
			width: 1920,
			height: 1080,
			viewportWidth: 960,
			viewportHeight: 540,
			zoom: 2
		})

		expect(ctx).toMatchObject({
			width: 1920,
			height: 1080,
			viewportWidth: 960,
			viewportHeight: 540,
			zoom: 2
		})
		expect(ctx.scale).toBe(0.5)
	})

	it('should fall back to defaults for missing values', () => {
		const ctx = createViewContext({ zoom: 2 })

		expect(ctx).toMatchObject({
			width: 1280,
			height: 720,
			viewportWidth: 1280,
			viewportHeight: 720,
			zoom: 2
		})
	})

	it('should scale to fit the viewport height', () => {
		const ctx = createViewContext({
			width: 1000,
			height: 1000,
			viewportWidth: 1000,
			viewportHeight: 500
		})

		expect(ctx.scale).toBe(0.5)
	})

	it('should scale to fit the viewport width', () => {
		const ctx = createViewContext({
			width: 1000,
			height: 1000,
			viewportWidth: 500,
			viewportHeight: 500
		})

		expect(ctx.scale).toBe(0.5)
	})

	it.each([
		['width', { width: -1 }],
		['height', { height: -1 }],
		['viewport width', { viewportWidth: -1 }],
		['viewport height', { viewportHeight: -1 }]
	])('should return zero scale when %s is invalid', (_, source) => {
		const ctx = createViewContext(source)

		expect(ctx.scale).toBe(0)
	})
})
