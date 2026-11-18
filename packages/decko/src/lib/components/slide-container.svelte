<script lang="ts">
	import type { Snippet } from 'svelte'

	import { useSlideContext, useViewContext } from '../context/index.js'
	import { asNumber } from '../logic/utils.js'
	import { appearance } from '../state/appearance.svelte.js'

	interface Props {
		outside?: Snippet
		children: Snippet
	}

	let { children, outside }: Props = $props()

	const viewContext = useViewContext()
	const slideContext = useSlideContext()
</script>

<section
	class="relative h-full w-full content-center overflow-hidden bg-[#242424] transition-all dark:bg-black"
	bind:clientWidth={viewContext.viewportWidth}
	bind:clientHeight={viewContext.viewportHeight}
>
	<section
		id="slide-container"
		class="bg-background absolute top-1/2 left-1/2 flex overflow-hidden"
		class:select-none={viewContext.zoom > 1}
		class:rounded-xl={appearance.slideScale < 1}
		style:font-size="{appearance.fontScale * asNumber(slideContext.slide.fontSize, 16)}px"
		style:width="{viewContext.width}px"
		style:height="{viewContext.height}px"
		style:translate="-50% -50%"
		style:scale={viewContext.scale * appearance.slideScale}
	>
		{@render children()}
	</section>

	{@render outside?.()}
</section>

<style lang="postcss">
	#slide-container {
		transform: translate(-50%, -50%) scale(var(--slide-scale));
		transition:
			background 300ms ease-in-out,
			color 300ms ease-in-out;
	}
</style>
