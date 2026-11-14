import { describe, expect, it } from 'vitest'

import { getCustomThemes, getThemes, resolveTheme } from './themes'

describe('getThemes', () => {
	it('should return themes as string array', () => {
		expect(getThemes('default,claude,catppucin')).toEqual(['default', 'claude', 'catppucin'])
	})
})

describe('resolveTheme', () => {
	it('should return available theme', () => {
		const availableList = ['default', 'claude', 'catppucin']

		expect(resolveTheme('catppucin', availableList)).toBe('catppucin')

		expect(resolveTheme('dracula', availableList)).toBe('default')

		expect(resolveTheme('dracula')).toBe('default')
	})
})

describe('getCustomThemes', () => {
	it('should return custom themes', () => {
		expect(getCustomThemes({ blue: 'blue.css', red: 10 })).toEqual({ blue: 'blue.css' })
	})

	it('should return undefined', () => {
		expect(getCustomThemes(null)).toBeUndefined()
		expect(getCustomThemes([])).toBeUndefined()
		expect(getCustomThemes(10)).toBeUndefined()
	})
})
