import { describe, expect, it } from 'vitest'

import { resolvePaginate } from './paginate.js'

describe('resolvePaginate', () => {
	it.each([
		[true, 1, { show: true, current: 2 }],
		['hold', 1, { show: true, current: 1 }],
		['skip', 1, { show: false, current: 1 }],
		[false, 1, { show: false, current: 2 }],
		[undefined, 3, { show: false, current: 4 }]
	])('should resolve %s with current %i', (paginate, current, expected) => {
		expect(resolvePaginate(paginate, current)).toEqual(expected)
	})
})
