import { isBrowser } from '../logic/events.js'
import { PersistedState } from './persisted.svelte.js'

export class Theme {
	#selected = new PersistedState<string>('deck-theme', 'default')
	#forced = $state<string>()
	#list = $state<string[]>([])

	constructor() {
		this.#appy()
	}

	#appy() {
		if (isBrowser()) {
			document.documentElement.dataset.theme = this.current
		}
	}

	get current() {
		return this.#forced ?? this.#selected.current
	}

	set current(v: string) {
		this.#forced = undefined
		this.#selected.current = v
	}

	get all() {
		return this.#list
	}

	setup(forced: string, themes: string[]) {
		this.#list = themes
		this.#forced = themes.find((t) => t === forced)
		this.#appy()
	}
}

export const themeState = new Theme()
