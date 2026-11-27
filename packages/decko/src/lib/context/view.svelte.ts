import { createContext } from 'svelte'

const [get, set] = createContext<ViewContext>()

export class ViewContext {
	width = $state<number>(1280)
	height = $state<number>(720)
	viewportWidth = $state<number>(1280)
	viewportHeight = $state<number>(720)

	minZoom = 1
	maxZoom = 3
	#zoom = $state<number>(1)

	constructor(width: number, height: number) {
		this.width = width
		this.height = height
	}

	static create(width: number, height: number) {
		return set(new ViewContext(width, height))
	}

	static get() {
		return get()
	}

	get zoom() {
		return this.#zoom
	}

	set zoom(val: number) {
		this.#zoom = Math.min(Math.max(val, this.minZoom), this.maxZoom)
	}

	get scale() {
		if (this.viewportWidth <= 0 || this.viewportHeight <= 0 || this.width <= 0 || this.height <= 0) {
			return 0
		}

		const aspect = this.width / this.height
		const scaledHeight = this.viewportWidth / aspect
		const finalWidth = scaledHeight > this.viewportHeight ? this.viewportHeight * aspect : this.viewportWidth

		return finalWidth / this.width
	}
}
