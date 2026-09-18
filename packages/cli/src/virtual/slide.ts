import { join } from 'node:path'

import { VirtualModule } from './types'

export const resolveSlideId = (src: string) => join('decko:slide', src + '.svelte')

export const resolveMarkdownId = (src: string) => join('decko:markdown', src)

export const virtualSlide: VirtualModule = {
	id: /^decko:slide\/.*\.svelte$/,
	content() {
		const src = this.id.replaceAll(/^decko:slide\/|\.svelte$/g, '')
		return [
			`<script lang="ts">`,
			`import { SlidePlayer } from '@decko/decko/components'`,
			`import Slide, { slide } from '${resolveMarkdownId(src)}'`,
			`</script>`,
			`<svelte:head>`,
			`<title>{slide.title}</title>`,
			`</svelte:head>`,
			`<main class="h-full w-full rounded-sm">`,
			`<SlidePlayer slide={Slide} data={slide} />`,
			`</main>`
		].join('\n')
	}
}

export const virtualMarkdown: VirtualModule = {
	id: /^decko:markdown\/.*/,
	content() {
		const src = this.id.replace(/^decko:markdown\//, '')
		const read = this.read(join(this.root, src))
		return read ?? '<h1>404</h1>'
	}
}
