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

describe('LocalStorage', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
		vi.resetModules()
	})

	it('should read the stored value', async () => {
		stubBrowser(createStorage({ key: 'value' }))

		const { LocalStorage } = await import('./storage.svelte.js')
		const store = new LocalStorage<string>('key', 'fallback')

		expect(store.current).toBe('value')
	})

	it('should use the fallback when the stored value is missing', async () => {
		stubBrowser()

		const { LocalStorage } = await import('./storage.svelte.js')
		const store = new LocalStorage<string>('key', 'fallback')

		expect(store.current).toBe('fallback')
	})

	it('should use the fallback outside a browser environment', async () => {
		vi.stubGlobal('localStorage', createStorage({ key: 'value' }))

		const { LocalStorage } = await import('./storage.svelte.js')
		const store = new LocalStorage<string>('key', 'fallback')

		expect(store.current).toBe('fallback')
	})

	it('should fall back when the current value is cleared', async () => {
		stubBrowser()

		const { LocalStorage } = await import('./storage.svelte.js')
		const store = new LocalStorage<string>('key', 'fallback')

		store.current = undefined as unknown as string

		expect(store.current).toBe('fallback')
	})

	it('should persist changes in a browser environment', async () => {
		const storage = stubBrowser()

		const { LocalStorage } = await import('./storage.svelte.js')
		const store = new LocalStorage<string>('key', 'fallback')

		store.current = 'next'

		expect(storage.setItem).toHaveBeenCalledWith('key', 'next')
	})

	it('should not persist changes outside a browser environment', async () => {
		const storage = createStorage()
		vi.stubGlobal('localStorage', storage)

		const { LocalStorage } = await import('./storage.svelte.js')
		const store = new LocalStorage<string>('key', 'fallback')

		store.current = 'next'

		expect(store.current).toBe('next')
		expect(storage.setItem).not.toHaveBeenCalled()
	})
})
