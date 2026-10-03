import { Feature } from './extensions/feature'
import type { SlideData } from './types'
import { mergeStr } from './utils'

export interface PageOptions {
	layout?: string
	class?: string
	style?: string
	background?: string
	pageNumber?: number
	split?: string
}

export function pageContent(content: string, page: number, opt: PageOptions = {}) {
	const className = opt.class ? `slide ${opt.class}` : 'slide'
	const style = opt.style ? `style="${opt.style}"` : ''
	const layout = opt.layout || 'default'

	const pages = [
		`{#if page === ${page}}`,
		`<section class='${className}' ${style} data-page='${page}'  layout='${layout}' transition:fade={{duration:100}}>`,
		opt.background ? `<div class='slide-background' style='${opt.background}'></div>` : '',
		opt.pageNumber ? `<div class="slide-page-number">${opt.pageNumber}</div>` : '',
		opt.split ? `<div class="split" style="${opt.split}">${content}</div>` : content,
		`</section>`,
		`{/if}`
	]

	return mergeStr('\n', ...pages)
}

export function styleContent(styleTag: string[] = []) {
	if (styleTag.length === 0) return ''

	const styles = [
		'<style lang="postcss">',
		'@reference "tailwindcss";',
		'@reference "../themes/decko.css";',
		...styleTag,
		'</style>'
	]

	return mergeStr('\n', ...styles)
}

interface ScriptOptions {
	data: SlideData
	scripts: string[]
	features: Set<Feature>
	assets: [string, string][]
}

export function scriptContent(opt: ScriptOptions) {
	const imports: string[] = []
	const runs: string[] = []

	// // svelte - auto remove when don't use
	imports.push(
		`import {blur,crossfade,draw,fade,fly,scale,slide as slide } from 'svelte/transition'`,
		`import { stepper } from '@decko/decko/client/stepper'`,
		'import { initCopyCode } from "@decko/decko/client/code"',
		'import { mermaidRender } from "@decko/decko/client/mermaid"',
		`import { CodeStepBlock } from "@decko/decko/components"`
	)

	if (opt.assets.length > 0) runs.push(...opt.assets.map(([p, v]) => `import ${v} from '${p}'`))
	if (opt.features.has(Feature.Code)) runs.push('initCopyCode()')

	const scripts = [
		`<script lang="ts" module>`,
		`const data = ${JSON.stringify(opt.data)}`,
		`export { data as slide }`,
		`</script>`,
		`<script lang="ts">`,
		...imports,
		...runs,
		`let { page=$bindable(),step=$bindable() } = $props()`,
		...opt.scripts,
		'</script>'
	]

	return mergeStr('\n', ...scripts)
}
