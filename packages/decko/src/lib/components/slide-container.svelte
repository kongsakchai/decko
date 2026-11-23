<script lang="ts">
	import type { Snippet } from 'svelte'

	import { useSlideContext, useViewContext } from '../context/index.js'
	import { asString } from '../logic/utils.js'
	import { appearance } from '../state/appearance.svelte.js'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()

	const viewContext = useViewContext()
	const slideContext = useSlideContext()

	const fontSize = asString(slideContext.slide.fontSize, '16px')
</script>

<!-- backdrop -->
<section
	class="relative h-full w-full overflow-hidden bg-[#242424] transition-all dark:bg-black"
	bind:clientWidth={viewContext.viewportWidth}
	bind:clientHeight={viewContext.viewportHeight}
>
	<!-- container -->
	<section
		id="slide-container"
		class="bg-background relative top-1/2 left-1/2 grid origin-center -translate-1/2 overflow-hidden"
		style:width="{viewContext.width}px"
		style:height="{viewContext.height}px"
		class:select-none={viewContext.zoom > 1}
		style:scale={viewContext.scale * appearance.slideScale}
		class:rounded-xl={appearance.slideScale < 1}
		style:font-size="calc({appearance.fontScale} * {fontSize})"
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
