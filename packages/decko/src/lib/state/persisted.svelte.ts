import { on } from 'svelte/events'
import { createSubscriber } from 'svelte/reactivity'

import { isBrowser } from '../logic/events'

export class PersistedState<T> {
	#key: string
	#fallback: T

	#storage?: Storage
	#subscribe?: () => void
	#update?: () => void

	constructor(key: string, fallback: T) {
		this.#key = key
		this.#fallback = fallback

		if (!isBrowser()) return

		this.#storage = window.localStorage
		this.#subscribe = createSubscriber((update) => {
			this.#update = update
			const off = on(window, 'storage', (e) => {
				if (e.key !== this.#key || e.newValue === null) return
				update()
			})
			return () => off()
		})
	}

	get current() {
		this.#subscribe?.()
		const store = this.#storage?.getItem(this.#key)
		return store ? JSON.parse(store) : this.#fallback
	}

	set current(val: T) {
		this.#update?.()
		this.#storage?.setItem(this.#key, JSON.stringify(val))
	}
}
