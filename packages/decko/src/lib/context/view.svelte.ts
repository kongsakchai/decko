import { createContext } from 'svelte'

import { calScale } from '../logic/scale.js'

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
	readonly scale = $derived(calScale(this.viewportWidth, this.viewportHeight, this.width, this.height))

	constructor(source?: Partial<ViewContext>) {
		this.width = source?.width || 1280
		this.height = source?.height || 720
		this.viewportWidth = source?.viewportWidth || 1280
		this.viewportHeight = source?.viewportHeight || 720
		this.zoom = source?.zoom || 1
	}
}

const [useViewContext, setViewContext] = createContext<ViewContext>()

export { useViewContext }

export function createViewContext(source?: Partial<ViewContext>): ViewContext {
	return setViewContext(new Context(source))
}
