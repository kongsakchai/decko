import { describe, expect, it } from 'vitest'

import { asNumber, asString, asStringArray, mergeStr } from './utils.js'

describe('asNumber', () => {
	it('should return number when value is number', () => {
		expect(asNumber(10)).toBe(10)
	})

	it('should return default when value is not number', () => {
		expect(asNumber('10', 0)).toBe(0)
	})
})

describe('asString', () => {
	it('should return string when value is string', () => {
		expect(asString('decko')).toBe('decko')
	})

	it('should return default when value is not number', () => {
		expect(asString(10, '')).toBe('')
	})
})

describe('mergeStr', () => {
	it('should merge `decko,markdown`', () => {
		expect(mergeStr(',', '', 'decko', '', 'markdown')).toBe('decko,markdown')
	})
})

describe('asStringArray', () => {
	it('should return string array when value is string or array string', () => {
		expect(asStringArray('decko,markdown,,svelte,decko')).toEqual(['decko', 'markdown', 'svelte', 'decko'])

		expect(asStringArray('decko,markdown,,svelte,decko', true)).toEqual(['decko', 'markdown', 'svelte'])

		expect(asStringArray(['decko', 'markdown', '', 'svelte', 'decko'], true)).toEqual([
			'decko',
			'markdown',
			'svelte'
		])
	})

	it('should return undefined when value is undefined', () => {
		expect(asStringArray(undefined, true)).toBeUndefined()
	})
})
