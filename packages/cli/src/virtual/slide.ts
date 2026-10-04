import path from 'node:path'

import { VirtualModule } from './types'

export const SLIDE_PREFIX = 'decko:slide/'
export const SLIDE_SUFFIX = '.svelte'

export function createSlideModuleId(id: string) {
	return path.join(SLIDE_PREFIX, id + SLIDE_SUFFIX)
}

export const virtualSlide: VirtualModule = {
	content(ctx) {
		return [
			`<script lang="ts">`,
			`import { SlidePlayer } from '@decko/decko/page'`,
			`import Slide, { slide } from '${ctx.data.markdown}'`,
			`</script>`,
			`<SlidePlayer slide={Slide} data={slide} />`
		].join('\n')
	}
}
