import { afterEach, describe, expect, it, vi } from 'vitest'

import { initCopyCode } from './code'

function createButton(pre: { textContent: string } | null, hasParent = true) {
	return {
		parentNode: hasParent ? { querySelector: vi.fn(() => pre) } : null,
		classList: {
			add: vi.fn(),
			remove: vi.fn()
		}
	}
}

describe('initCopyCode', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.useRealTimers()
		vi.restoreAllMocks()
	})

	it('should do nothing when window is undefined', () => {
		vi.stubGlobal('window', undefined)

		expect(() => initCopyCode()).not.toThrow()
	})

	it('should register copyCode on window', () => {
		const window = {} as Window & typeof globalThis
		vi.stubGlobal('window', window)

		initCopyCode()

		expect(window.copyCode).toBeTypeOf('function')
	})

	it('should copy code and show the copied state', async () => {
		vi.useFakeTimers()
		const pre = { textContent: 'const answer = 42' }
		const button = createButton(pre)
		const writeText = vi.fn().mockResolvedValue(undefined)
		const window = {} as Window & typeof globalThis

		vi.stubGlobal('navigator', { clipboard: { writeText } })
		vi.stubGlobal('window', window)
		initCopyCode()

		window.copyCode({ currentTarget: button } as unknown as Event)
		await vi.runAllTimersAsync()

		expect(writeText).toHaveBeenCalledWith(pre.textContent)
		expect(button.classList.add).toHaveBeenCalledWith('copied')
		expect(button.classList.remove).toHaveBeenCalledWith('copied')
	})

	it('should log when copying fails', async () => {
		const error = new Error('copy failed')
		const button = createButton({ textContent: 'const answer = 42' })
		const writeText = vi.fn().mockRejectedValue(error)
		const window = {} as Window & typeof globalThis
		const consoleLog = vi.spyOn(console, 'log').mockImplementation(() => {})

		vi.stubGlobal('navigator', { clipboard: { writeText } })
		vi.stubGlobal('window', window)
		initCopyCode()

		window.copyCode({ currentTarget: button } as unknown as Event)

		await vi.waitFor(() => expect(consoleLog).toHaveBeenCalledWith('copy fail', error))
	})

	it('should do nothing when there is no pre element', () => {
		const button = createButton(null)
		const writeText = vi.fn()
		const window = {} as Window & typeof globalThis

		vi.stubGlobal('navigator', { clipboard: { writeText } })
		vi.stubGlobal('window', window)
		initCopyCode()

		window.copyCode({ currentTarget: button } as unknown as Event)

		expect(writeText).not.toHaveBeenCalled()
	})

	it('should do nothing when the button has no parent', () => {
		const button = createButton(null, false)
		const writeText = vi.fn()
		const window = {} as Window & typeof globalThis

		vi.stubGlobal('navigator', { clipboard: { writeText } })
		vi.stubGlobal('window', window)
		initCopyCode()

		window.copyCode({ currentTarget: button } as unknown as Event)

		expect(writeText).not.toHaveBeenCalled()
	})
})
