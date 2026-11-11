import { describe, expect, it } from 'vitest'

import { handleResolveAll } from '../../src/extensions/resolve'

describe('resolve', () => {
	it('should return [] when constructs is undefined', () => {
		const result = handleResolveAll(undefined, [], {} as any)
		expect(result.length).toBe(0)
	})
})
