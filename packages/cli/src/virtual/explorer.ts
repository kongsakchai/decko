import path from 'node:path'

import { VirtualModule } from './types'

export const virtualExplorer: VirtualModule = {
	content(ctx) {
		const title = path.basename(ctx.external.root)
		return [
			`<script lang="ts">`,
			`import { Explorer } from '@decko/decko/page'`,
			`const contents: string[] = ${JSON.stringify(ctx.external.markdowns())}`,
			`</script>`,
			`<Explorer title="${title}" files={contents} />`
		].join('\n')
	}
}
