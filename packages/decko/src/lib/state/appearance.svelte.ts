import { resolveTheme } from '../logic/themes'
import { StateStorage } from './storage.svelte'

export class Appearance {
	#mode = new StateStorage<'light' | 'dark'>('decko-theme-mode', 'light')
	#theme = new StateStorage<string>('deck-theme', 'default')
	#fontScale = new StateStorage<string>('decko-font-scale', '1')
	#slideScale = new StateStorage<string>('decko-slide-scale', '1')

	#themes = $state<string[]>([])
	#defaultTheme = $state<string>()

	get isDark() {
		return this.#mode.current === 'dark'
	}

	toggleDark() {
		this.#mode.current = this.#mode.current === 'dark' ? 'light' : 'dark'
	}

	get theme() {
		return this.#defaultTheme ?? this.#theme.current
	}

	set theme(val: string) {
		this.#defaultTheme = undefined
		this.#theme.current = val
	}

	get fontScale() {
		const value = Number.parseFloat(this.#fontScale.current)
		return Number.isNaN(value) ? 1 : value
	}

	set fontScale(val: number) {
		this.#fontScale.current = val.toString()
	}

	get slideScale() {
		const value = Number.parseFloat(this.#slideScale.current)
		return Number.isNaN(value) ? 1 : value
	}

	set slideScale(val: number) {
		this.#slideScale.current = val.toString()
	}

	get themes() {
		return this.#themes
	}

	setupThemes(defaultTheme: string, themes: string[]) {
		this.#themes = themes
		this.#defaultTheme = resolveTheme(defaultTheme, themes)
	}
}

export const appearance = new Appearance()
