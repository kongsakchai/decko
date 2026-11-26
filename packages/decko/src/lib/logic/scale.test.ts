import { describe, expect, it } from 'vitest'

import { calScale } from './scale.js'

describe('calScale', () => {
	it('should scale to fit the viewport height', () => {
		const width = 1000
		const height = 1000
		const viewportWidth = 1000
		const viewportHeight = 500

		expect(calScale(viewportWidth, viewportHeight, width, height)).toBe(0.5)
	})

	it('should scale to fit the viewport width', () => {
		const width = 1000
		const height = 1000
		const viewportWidth = 500
		const viewportHeight = 500

		expect(calScale(viewportWidth, viewportHeight, width, height)).toBe(0.5)
	})

	it.each([
		['width', { width: -1, height: 1000, viewportWidth: 1000, viewportHeight: 500 }],
		['height', { width: 1000, height: -1, viewportWidth: 1000, viewportHeight: 500 }],
		['viewport width', { width: 1000, height: 1000, viewportWidth: -1, viewportHeight: 500 }],
		['viewport height', { width: 1000, height: 1000, viewportWidth: 1000, viewportHeight: -1 }]
	])('should return zero scale when %s is invalid', (_, source) => {
		expect(calScale(source.viewportWidth, source.viewportHeight, source.width, source.height)).toBe(0)
	})
})
