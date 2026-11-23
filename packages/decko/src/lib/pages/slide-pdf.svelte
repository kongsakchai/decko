<script lang="ts">
	import type { SlideComponent, SlideData } from '../types.js'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: Slide, width = 1280, height = 720 }: Props = $props()
</script>

<svelte:head>
	<title>🌱 PDF {data.title}</title>
</svelte:head>

<section id="pdf-container" class="h-full w-full overflow-scroll bg-[#242424] dark:bg-black">
	<section
		style:width="{width}px"
		style:--slide-height="{height}px"
		class="mx-auto flex origin-top zoom-50 flex-col gap-1"
	>
		<Slide page={0} step={0} showAll />
	</section>
</section>

<style lang="postcss">
	#pdf-container :global(section.slide) {
		min-height: var(--slide-height);
		height: auto;

		&::before {
			background-color: var(--color-background);
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			inset: 0;
			z-index: -1;
			user-select: none;
			top: 0;
			left: 0;
		}
	}
</style>
