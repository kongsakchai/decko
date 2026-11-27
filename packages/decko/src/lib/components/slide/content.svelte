<script lang="ts">
	import { SlideContext, ViewContext } from '@/context/index.js'
	import { slideScaleState } from '@/state/index.js'
	import type { SlideComponent } from '@/types.js'

	interface Props {
		component: SlideComponent
	}

	const { component: SlideContent }: Props = $props()
	const slide = SlideContext.get()
	const view = ViewContext.get()
</script>

<SlideContent page={slide.page} step={slide.step} slideScale={view.effectiveScale * slideScaleState.current} />
