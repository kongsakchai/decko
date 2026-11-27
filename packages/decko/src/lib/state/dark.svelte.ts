import { isBrowser } from '@/logic/events.js'

import { PersistedState } from './persisted.svelte.js'

export class DarkMode {
	#mode = new PersistedState<'light' | 'dark'>('decko-theme-mode', 'light')

	constructor() {
		this.#appy()
	}

	#appy() {
		if (isBrowser()) {
			document.documentElement.classList.toggle('dark', this.isDark)
		}
	}

	get isDark() {
		return this.#mode.current === 'dark'
	}

	toggle() {
		this.#mode.current = this.isDark ? 'light' : 'dark'
		this.#appy()
	}
}

export const darkModeState = new DarkMode()
