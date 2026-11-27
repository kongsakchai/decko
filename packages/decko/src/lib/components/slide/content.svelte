<script lang="ts">
	import { slideScaleState } from '@deckomd/decko/state/scale.svelte.js'
	import { SlideContext, ViewContext } from '../../context/index.js'
	import type { SlideComponent } from '../../types.js'

	interface Props {
		component: SlideComponent
	}

	const { component: SlideContent }: Props = $props()
	const slide = SlideContext.get()
	const view = ViewContext.get()

	const scale = $derived(view.scale * view.zoom * slideScaleState.current)
</script>

<SlideContent page={slide.page} step={slide.step} slideScale={scale} />
