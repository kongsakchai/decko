<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		slide?: Snippet
		width?: number
		height?: number
	}

	const { slide, width = 1280, height = 720 }: Props = $props()
</script>

<section class="h-full w-full overflow-scroll bg-[#242424] dark:bg-black">
	<section
		id="pdf-container"
		style:width="{width}px"
		style:--slide-height="{height}px"
		class="mx-auto flex origin-top flex-col gap-1"
	>
		{@render slide?.()}
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
			z-index: -2;
			user-select: none;
			top: 0;
			left: 0;
		}
	}
</style>
