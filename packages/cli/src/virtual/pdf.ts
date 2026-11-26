import path from 'node:path'

import { VirtualContent } from './types.js'

export const PDF_PREFIX = 'decko:pdf/'
export const PDF_SUFFIX = '.svelte'

export function createPDFModuleId(id: string) {
	return path.join(PDF_PREFIX, id + PDF_SUFFIX)
}

export const virtualPDF: VirtualContent = (ctx) => {
	const markdown = ctx.single ?? ctx.data?.markdown
	if (!markdown) return `<h1>404</h1>`
	return [
		`<script lang="ts">`,
		`import { SlidePDF } from '@deckomd/decko/pages'`,
		`import Slide, { data } from '${markdown}'`,
		`</script>`,
		`<SlidePDF slide={Slide} data={data} />`
	].join('\n')
}
