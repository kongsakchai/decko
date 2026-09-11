import { VirtualModule } from './types'

export const virtualDirectory: VirtualModule = {
	id: 'decko:directory.svelte',
	content() {
		const markdowns = [...this.markdowns]
		return [
			`<script lang="ts">`,
			`import { Explorer } from '@decko/decko/components'`,
			`const contents: string[] = ${JSON.stringify(markdowns)}`,
			`</script>`,
			`<main class="h-full w-full p-6">`,
			`<Explorer files={contents} />`,
			`</main>`
		].join('\n')
	}
}
