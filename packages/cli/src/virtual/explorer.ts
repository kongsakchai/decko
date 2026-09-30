import path from 'node:path'

import { VirtualModule } from './types'

export const virtualExplorer: VirtualModule = {
	id: 'decko:explorer.svelte',
	content() {
		const markdowns = [...this.markdowns]
		const title = path.basename(this.root)
		return [
			`<script lang="ts">`,
			`import { Explorer } from '@decko/decko/page'`,
			`const contents: string[] = ${JSON.stringify(markdowns)}`,
			`</script>`,
			`<Explorer title="${title}" files={contents} />`
		].join('\n')
	}
}
