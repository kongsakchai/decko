<script lang="ts">
	import type { Snippet } from 'svelte'

	import { ViewContext } from '@deckomd/decko/context/view.svelte.js'
	import { fontScaleState, slideScaleState } from '@deckomd/decko/state'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()

	const view = ViewContext.get()
</script>

<!-- backdrop -->
<section
	class="relative h-full w-full overflow-hidden bg-[#242424] transition-all dark:bg-black"
	bind:clientWidth={view.viewportWidth}
	bind:clientHeight={view.viewportHeight}
>
	<!-- container -->
	<section
		id="slide-container"
		class="bg-background relative top-1/2 left-1/2 grid origin-center -translate-1/2 overflow-hidden"
		class:select-none={view.zoom > 1}
		style:width="{view.width}px"
		style:height="{view.height}px"
		style:scale={view.scale * slideScaleState.current}
		class:rounded-xl={slideScaleState.current < 1}
		style:--font-scale={fontScaleState.current}
	>
		{@render children?.()}
	</section>
</section>

<style lang="postcss">
	#slide-container {
		transition:
			background 300ms ease-in-out,
			color 300ms ease-in-out;
	}
</style>
