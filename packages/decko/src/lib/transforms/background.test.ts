import { describe, expect, it } from 'vitest'

import { toBackgroundStyles } from './background.js'

describe('toBackgroundStyles', () => {
	it('should return empty string when there are no background props', () => {
		expect(toBackgroundStyles({})).toBe('')
		expect(toBackgroundStyles({ bg: null, 'bg-color': 10 })).toBe('')
	})

	it('should convert background props to styles', () => {
		expect(
			toBackgroundStyles({
				bg: '#fff',
				'bg-color': 'red',
				'bg-image': 'url(image.png)',
				'bg-size': 'cover',
				'bg-position': 'center',
				'bg-opacity': '0.5',
				'bg-filter': 'blur(2px)',
				unrelated: 'ignored'
			})
		).toBe(
			'background: #fff;background-color: red;background-image: url(image.png);background-size: cover;background-position: center;opacity: 0.5;filter: blur(2px)'
		)
	})

	it('should only include string values', () => {
		expect(toBackgroundStyles({ bg: '#fff', 'bg-color': 10, 'bg-image': null })).toBe('background: #fff')
	})
})
