import { afterEach, describe, expect, it, vi } from 'vitest'

function createStorage(values: Record<string, string> = {}) {
	return {
		getItem: vi.fn((key: string) => values[key] ?? null),
		setItem: vi.fn()
	}
}

function stubBrowser(storage = createStorage()) {
	vi.stubGlobal('window', {})
	vi.stubGlobal('document', {})
	vi.stubGlobal('localStorage', storage)
	return storage
}

describe('appearance', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetModules()
	})

	it('should use fallback values when storage is empty', async () => {
		vi.stubGlobal('localStorage', createStorage())

		const { appearance } = await import('./appearance.svelte.js')

		expect(appearance.isDark).toBe(false)
		expect(appearance.theme).toBe('default')
		expect(appearance.fontScale).toBe(1)
		expect(appearance.slideScale).toBe(1)
	})

	it('should initialize from localStorage', async () => {
		const storage = stubBrowser(
			createStorage({
				'decko-theme-mode': 'dark',
				'deck-theme': 'claude',
				'decko-font-scale': '1.5',
				'decko-slide-scale': '0.8'
			})
		)

		const { appearance } = await import('./appearance.svelte.js')

		expect(appearance.isDark).toBe(true)
		expect(appearance.theme).toBe('claude')
		expect(appearance.fontScale).toBe(1.5)
		expect(appearance.slideScale).toBe(0.8)
		expect(storage.getItem).toHaveBeenCalledWith('decko-theme-mode')
	})

	it('should toggle between light and dark modes', async () => {
		const storage = stubBrowser()

		const { appearance } = await import('./appearance.svelte.js')

		appearance.toggleDark()
		expect(appearance.isDark).toBe(true)
		expect(storage.setItem).toHaveBeenLastCalledWith('decko-theme-mode', 'dark')

		appearance.toggleDark()
		expect(appearance.isDark).toBe(false)
		expect(storage.setItem).toHaveBeenLastCalledWith('decko-theme-mode', 'light')
	})

	it('should change and persist the theme', async () => {
		const storage = stubBrowser()

		const { appearance } = await import('./appearance.svelte.js')

		appearance.theme = 'dracula'

		expect(appearance.theme).toBe('dracula')
		expect(storage.setItem).toHaveBeenLastCalledWith('deck-theme', 'dracula')
	})

	it('should change and persist the scales', async () => {
		const storage = stubBrowser()

		const { appearance } = await import('./appearance.svelte.js')

		appearance.fontScale = 1.25
		appearance.slideScale = 0.75

		expect(appearance.fontScale).toBe(1.25)
		expect(appearance.slideScale).toBe(0.75)
		expect(storage.setItem).toHaveBeenCalledWith('decko-font-scale', '1.25')
		expect(storage.setItem).toHaveBeenCalledWith('decko-slide-scale', '0.75')
	})

	it('should fall back to 1 for invalid scales', async () => {
		stubBrowser(createStorage({ 'decko-font-scale': 'abc', 'decko-slide-scale': 'abc' }))

		const { appearance } = await import('./appearance.svelte.js')

		expect(appearance.fontScale).toBe(1)
		expect(appearance.slideScale).toBe(1)
	})

	it('should not persist outside a browser environment', async () => {
		const storage = createStorage()
		vi.stubGlobal('localStorage', storage)

		const { appearance } = await import('./appearance.svelte.js')

		appearance.toggleDark()
		appearance.theme = 'dracula'

		expect(appearance.isDark).toBe(true)
		expect(storage.setItem).not.toHaveBeenCalled()
	})
})
