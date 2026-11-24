import type { SlideData } from '../types'
import { createSlideContext } from './slide.svelte'
import { type ViewContext, createViewContext } from './view.svelte'

export function createDeckContex(data: SlideData, view?: Partial<ViewContext>) {
	return {
		slide: createSlideContext(data),
		view: createViewContext(view)
	}
}
