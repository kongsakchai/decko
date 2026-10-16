import path from 'node:path'

import { VirtualModuleContent } from './types'

export const EXPLORER_ID = 'decko:explorer.svelte'

export const virtualExplorer: VirtualModuleContent = (ctx) => {
	const title = path.basename(ctx.external.root)
	return [
		`<script lang="ts">`,
		`import { Explorer } from '@decko/decko/page'`,
		`const contents: string[] = ${JSON.stringify(ctx.external.markdowns())}`,
		`</script>`,
		`<Explorer title="${title}" files={contents} />`
	].join('\n')
}
