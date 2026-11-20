import { afterEach, describe, expect, it, vi } from 'vitest'

import { onBrowser } from './events.js'

describe('onBrowser', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should call function in a browser environment', () => {
		vi.stubGlobal('window', {})
		vi.stubGlobal('document', {})
		const fn = vi.fn()

		onBrowser(fn)

		expect(fn).toHaveBeenCalledOnce()
	})

	it('should not call function outside a browser environment', () => {
		vi.stubGlobal('window', undefined)
		vi.stubGlobal('document', undefined)
		const fn = vi.fn()

		onBrowser(fn)

		expect(fn).not.toHaveBeenCalled()
	})
})
