import { afterEach, describe, expect, it, vi } from 'vitest'

import { onBrowser } from './events'

describe('onBrowser', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should call function when window is defined', () => {
		vi.stubGlobal('window', {})
		const fn = vi.fn()

		onBrowser(fn)

		expect(fn).toHaveBeenCalledOnce()
	})

	it('should not call function when window is undefined', () => {
		const fn = vi.fn()

		onBrowser(fn)

		expect(fn).not.toHaveBeenCalled()
	})
})
