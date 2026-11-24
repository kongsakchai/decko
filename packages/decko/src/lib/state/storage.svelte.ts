import { isBrowser } from '../logic/events'

export class StateStorage<T extends string = string> {
	#key: string
	#fallback: T
	#storage: Storage

	#value = $state<T>()

	constructor(key: string, fallback: T, storage = localStorage) {
		this.#key = key
		this.#fallback = fallback
		this.#storage = storage
		this.#value = (isBrowser() ? (storage.getItem(key) as T) : null) ?? fallback
	}

	get current() {
		return this.#value ?? this.#fallback
	}

	set current(val: T) {
		this.#value = val
		if (isBrowser()) {
			this.#storage.setItem(this.#key, val)
		}
	}
}
