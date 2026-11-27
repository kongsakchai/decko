<script lang="ts">
	import '@shikijs/magic-move/style.css'
	import { ShikiMagicMovePrecompiled } from '@shikijs/magic-move/svelte'

	import lz from 'lz-string'

	interface Props {
		code: string
		step: number
		globalScale?: number
		start?: number
	}

	const { code: baseCode, start = 0, globalScale = 1, step }: Props = $props()

	let steps = $derived(JSON.parse(lz.decompressFromBase64(baseCode)))
	let codeStep = $derived(Math.max(0, Math.min(step - start, steps.length)))
</script>

<ShikiMagicMovePrecompiled class="code-block" step={codeStep} {steps} options={{ globalScale: globalScale }} />
