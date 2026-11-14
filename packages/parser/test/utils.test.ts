import { describe, expect, it } from 'vitest'

import { asString } from '../src/utils'

describe('asString', () => {
	it('should return value when it is a string', () => {
		expect(asString('decko')).toBe('decko')
	})

	it('should return default value when it is not a string', () => {
		expect(asString(1, 'decko')).toBe('decko')
		expect(asString(null)).toBeUndefined()
		expect(asString(undefined, 'decko')).toBe('decko')
	})
})