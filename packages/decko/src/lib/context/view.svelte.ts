import { createContext } from 'svelte'

export interface ViewContext {
	width: number
	height: number
	viewportWidth: number
	viewportHeight: number
	zoom: number
	readonly scale: number
}

class Context implements ViewContext {
	width = $state<number>(1280)
	height = $state<number>(720)
	viewportWidth = $state<number>(1280)
	viewportHeight = $state<number>(720)
	zoom = $state<number>(1)

	constructor(source?: Partial<ViewContext>) {
		this.width = source?.width || 1280
		this.height = source?.height || 720
		this.viewportWidth = source?.viewportWidth || 1280
		this.viewportHeight = source?.viewportHeight || 720
		this.zoom = source?.zoom || 1
	}

	get scale() {
		if (this.width <= 0 || this.height <= 0 || this.viewportWidth <= 0 || this.viewportHeight <= 0) {
			return 0
		}

		const aspect = this.width / this.height
		const scaledHeight = this.viewportWidth / aspect
		const isOverHeight = scaledHeight > this.viewportHeight
		const finalWidth = isOverHeight ? this.viewportHeight * aspect : this.viewportWidth

		return finalWidth / this.width
	}
}

const [useViewContext, setViewContext] = createContext<ViewContext>()

export { useViewContext }

export function createViewContext(source?: Partial<ViewContext>): ViewContext {
	return setViewContext(new Context(source))
}
