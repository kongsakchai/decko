import path from 'node:path'

import { VirtualContent } from './types'

export const SLIDE_PREFIX = 'decko:slide/'
export const SLIDE_SUFFIX = '.svelte'

export function createSlideModuleId(id: string) {
	return path.join(SLIDE_PREFIX, id + SLIDE_SUFFIX)
}

export const virtualSlide: VirtualContent = (ctx) => {
	const markdown = ctx.markdown ?? ctx.data?.markdown
	if (!markdown) return `<h1>404</h1>`
	return [
		`<script lang="ts">`,
		`import { SlidePlayer } from '@decko/decko/page'`,
		`import Slide, { slide } from '${markdown}'`,
		`</script>`,
		`<SlidePlayer slide={Slide} data={slide} />`
	].join('\n')
}
