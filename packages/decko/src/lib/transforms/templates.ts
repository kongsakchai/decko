import type { Directive } from '@deckomd/parser'

import { mergeStr } from '../logic/utils.js'
import type { SlideData } from '../types.js'

export interface PageOptions {
	layout?: string
	class?: string
	style?: string
	background?: string
	pageNumber?: number
	split?: string
}

export function pageContent(content: string, page: number, opts: PageOptions = {}) {
	const className = opts.class ? `slide ${opts.class}` : 'slide'
	const style = opts.style ? `style="${opts.style}"` : ''
	const layout = opts.layout || 'default'

	const disableRules = ['<!-- svelte-ignore a11y_no_noninteractive_tabindex -->']
	const pages = [
		`{#if page === ${page} || showAll}`,
		`<section class='${className}' class:show-all={showAll} ${style} data-page='${page}'  layout='${layout}' transition:fade={{duration:100}}>`,
		opts.background ? `<div class='slide-background' style='${opts.background}'></div>` : '',
		opts.pageNumber ? `<div class="slide-page-number">${opts.pageNumber}</div>` : '',
		opts.split ? `<div class="split" style="${opts.split}">${content}</div>` : content,
		`</section>`,
		`{/if}`
	]

	return mergeStr('\n', ...disableRules, ...pages)
}

interface StyleOptions {
	styles: string[]
}

export function styleContent(opts: StyleOptions) {
	if (opts.styles.length === 0) return ''

	const styles = [
		'<style lang="postcss">',
		'@reference "tailwindcss";',
		'@reference "@deckomd/decko";',
		...opts.styles,
		'</style>'
	]

	return mergeStr('\n', ...styles)
}

interface ScriptOptions {
	data: SlideData
	scripts: string[]
	extra: Directive
	imports: string[]
}

export function scriptContent(opts: ScriptOptions) {
	const imports: string[] = []
	const runs: string[] = []

	// // svelte - auto remove when don't use
	imports.push(
		`import {blur,crossfade,draw,fade,fly,scale,slide as slide } from 'svelte/transition'`,
		`import { stepper } from '@deckomd/decko/logic/stepper'`,
		'import { initCopyCode } from "@deckomd/decko/logic/copy-code"',
		`import { CodeStepBlock } from "@deckomd/decko/components"`,
		...opts.imports
	)

	if (opts.extra.hasCode) {
		runs.push('initCopyCode()')
	}

	const scripts = [
		`<script lang="ts" module>`,
		`export const data = ${JSON.stringify(opts.data)}`,
		`</script>`,
		`<script lang="ts">`,
		...imports,
		...runs,
		`let { page=$bindable(),step=$bindable(),showAll } = $props()`,
		...opts.scripts,
		'</script>'
	]

	return mergeStr('\n', ...scripts)
}
