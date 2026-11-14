import { describe, expect, it } from 'vitest'

import { Feature, getFeatures } from './feature.js'

describe('getFeatures', () => {
	it('should create a feature set when missing', () => {
		const extra = {}

		const features = getFeatures(extra)

		expect(features).toBeInstanceOf(Set)
		expect(extra).toHaveProperty('features', features)
		expect(features.size).toBe(0)
	})

	it('should return the existing feature set', () => {
		const features = new Set([Feature.Code])
		const extra = { features }

		expect(getFeatures(extra)).toBe(features)
	})

	it('should define feature values', () => {
		expect(Feature.Mermaid).toBe(0)
		expect(Feature.MagicMove).toBe(1)
		expect(Feature.Code).toBe(2)
	})
})
