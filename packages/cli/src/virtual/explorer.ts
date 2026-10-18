import path from 'node:path'

import { VirtualContent } from './types'

export const EXPLORER_ID = 'decko:explorer.svelte'

export const virtualExplorer: VirtualContent = (ctx) => {
	const title = path.basename(ctx.root)
	return [
		`<script lang="ts">`,
		`import { Explorer } from '@decko/decko/page'`,
		`const contents: string[] = ${JSON.stringify(ctx.markdowns())}`,
		`</script>`,
		`<Explorer title="${title}" files={contents} />`
	].join('\n')
}
