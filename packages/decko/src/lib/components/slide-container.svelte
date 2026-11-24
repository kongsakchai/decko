<script lang="ts">
	import type { Snippet } from 'svelte'

	import { useViewContext } from '../context/index.js'
	import { appearance } from '../state/appearance.svelte.js'

	interface Props {
		children?: Snippet
	}

	let { children }: Props = $props()

	const viewContext = useViewContext()
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
		class:select-none={viewContext.zoom > 1}
		class:rounded-xl={appearance.slideScale < 1}
		style:width="{viewContext.width}px"
		style:height="{viewContext.height}px"
		style:scale={viewContext.scale * appearance.slideScale}
		style:--font-scale={appearance.fontScale}
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
