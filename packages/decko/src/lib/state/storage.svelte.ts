import { isBrowser } from '../logic/events'

export class LocalStorage<T extends string = string> {
	#key: string
	#fallback: T
	#value = $state<T>()

	constructor(key: string, fallback: T) {
		this.#key = key
		this.#fallback = fallback
		this.#value = (isBrowser() ? (localStorage.getItem(key) as T) : null) ?? fallback
	}

	get current() {
		return this.#value ?? this.#fallback
	}

	set current(val: T) {
		this.#value = val
		if (isBrowser()) {
			localStorage.setItem(this.#key, val)
		}
	}
}
