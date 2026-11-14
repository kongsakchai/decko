import { afterEach, describe, expect, it, vi } from 'vitest'

function createStorage(values: Record<string, string> = {}) {
	return {
		getItem: vi.fn((key: string) => values[key] ?? null),
		setItem: vi.fn()
	}
}

function createDocument() {
	return {
		documentElement: {
			classList: {
				toggle: vi.fn()
			},
			dataset: {} as DOMStringMap
		}
	}
}

describe('themeState', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetModules()
	})

	it('should use fallback values when window is undefined', async () => {
		vi.stubGlobal('window', undefined)

		const { themeState } = await import('./theme.svelte.js')

		expect(themeState.isDark).toBe(false)
		expect(themeState.theme).toBe('default')

		themeState.toggleMode()
		themeState.changeTheme('dracula')

		expect(themeState.isDark).toBe(false)
		expect(themeState.theme).toBe('default')
	})

	it('should initialize from localStorage and apply the theme', async () => {
		const storage = createStorage({ 'decko.mode': 'dark', 'decko.theme': 'claude' })
		const document = createDocument()

		vi.stubGlobal('window', {})
		vi.stubGlobal('localStorage', storage)
		vi.stubGlobal('document', document)

		const { themeState } = await import('./theme.svelte.js')

		expect(themeState.isDark).toBe(true)
		expect(themeState.theme).toBe('claude')
		expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', true)
		expect(document.documentElement.dataset.theme).toBe('claude')
	})

	it('should use fallback values when localStorage is empty', async () => {
		const storage = createStorage()
		const document = createDocument()

		vi.stubGlobal('window', {})
		vi.stubGlobal('localStorage', storage)
		vi.stubGlobal('document', document)

		const { themeState } = await import('./theme.svelte.js')

		expect(themeState.isDark).toBe(false)
		expect(themeState.theme).toBe('default')
		expect(document.documentElement.classList.toggle).toHaveBeenCalledWith('dark', false)
		expect(document.documentElement.dataset.theme).toBe('default')
	})

	it('should toggle between light and dark modes', async () => {
		const storage = createStorage()
		const document = createDocument()

		vi.stubGlobal('window', {})
		vi.stubGlobal('localStorage', storage)
		vi.stubGlobal('document', document)

		const { themeState } = await import('./theme.svelte.js')

		themeState.toggleMode()
		expect(themeState.isDark).toBe(true)
		expect(document.documentElement.classList.toggle).toHaveBeenLastCalledWith('dark', true)
		expect(storage.setItem).toHaveBeenLastCalledWith('decko.mode', 'dark')

		themeState.toggleMode()
		expect(themeState.isDark).toBe(false)
		expect(document.documentElement.classList.toggle).toHaveBeenLastCalledWith('dark', false)
		expect(storage.setItem).toHaveBeenLastCalledWith('decko.mode', 'light')
	})

	it('should change and apply the theme', async () => {
		const storage = createStorage()
		const document = createDocument()

		vi.stubGlobal('window', {})
		vi.stubGlobal('localStorage', storage)
		vi.stubGlobal('document', document)

		const { themeState } = await import('./theme.svelte.js')

		themeState.changeTheme('dracula')

		expect(themeState.theme).toBe('dracula')
		expect(document.documentElement.dataset.theme).toBe('dracula')
		expect(storage.setItem).toHaveBeenLastCalledWith('decko.theme', 'dracula')
	})
})
