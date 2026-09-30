<script lang="ts">
	import { untrack } from 'svelte'

	import { useURLState } from '../client/url.svelte'
	import { Container, SlideControl, StepProgress, ZoomLayout } from '../components'
	import { createSlideContext, createViewContext } from '../context'
	import type { SlideComponent, SlideData } from '../types'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: Slide, width = 1280, height = 720 }: Props = $props()

	const slideCtx = createSlideContext(untrack(() => data))

	const viewCtx = createViewContext(untrack(() => ({ width, height })))

	useURLState()

	$effect(() => {
		slideCtx.slide = data
	})

	$effect(() => {
		viewCtx.width = width
		viewCtx.height = height
	})
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<main class="h-full w-full">
	<Container>
		<ZoomLayout>
			<Slide bind:page={slideCtx.page} bind:step={slideCtx.step} />
		</ZoomLayout>

		<StepProgress />

		{#snippet outside()}
			<SlideControl />
		{/snippet}
	</Container>
</main>

<style lang="postcss">
	main {
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}
</style>
