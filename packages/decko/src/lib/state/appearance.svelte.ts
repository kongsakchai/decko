import { LocalStorage } from './storage.svelte'

export class Appearance {
	#mode = new LocalStorage<'light' | 'dark'>('decko-theme-mode', 'light')
	#theme = new LocalStorage<string>('deck-theme', 'default')
	#fontScale = new LocalStorage<string>('decko-font-scale', '1')
	#slideScale = new LocalStorage<string>('decko-slide-scale', '1')

	get isDark() {
		return this.#mode.current === 'dark'
	}

	toggleDark() {
		this.#mode.current = this.#mode.current === 'dark' ? 'light' : 'dark'
	}

	get theme() {
		return this.#theme.current
	}

	set theme(val: string) {
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
}

export const appearance = new Appearance()
