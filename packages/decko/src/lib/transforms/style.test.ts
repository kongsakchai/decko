import { describe, expect, it } from 'vitest'

import { toStyles } from './styles.js'

describe('toStyles', () => {
	it('should return empty string when there are no styles props', () => {
		expect(toStyles({})).toBe('')
		expect(toStyles({ class: 'bg-red-500', style: '' })).toBe('')
	})

	it('should convert styles props to styles', () => {
		expect(
			toStyles({
				style: 'color:red;',
				font: 'mali',
				fontMono: 'GeistMono NF'
			})
		).toBe('color:red;--font-primary:mali;--font-mono:GeistMono NF')
	})
})
