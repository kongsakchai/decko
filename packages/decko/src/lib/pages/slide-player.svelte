<script lang="ts">
	import { SlideContainer, SlideControl, StepProgress, ZoomLayout } from '../components/index.js'
	import { createSlideContext, createViewContext } from '../context/index.js'
	import { isBrowser } from '../logic/events.js'
	import { asNumber } from '../logic/utils.js'
	import type { SlideComponent, SlideData } from '../types.js'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: Slide, width = 1280, height = 720 }: Props = $props()

	// svelte-ignore state_referenced_locally
	const slideCtx = createSlideContext(data)
	// svelte-ignore state_referenced_locally
	const viewCtx = createViewContext({ width, height, fontSize: asNumber(data.fontSize) })

	if (isBrowser() && window.location.hash) {
		const page = Number.parseInt(window.location.hash.slice(1))
		if (!Number.isNaN(page)) slideCtx.goto(page)
	}

	$effect(() => {
		navigation.navigate(`#${slideCtx.page}`, { history: 'replace' })
	})

	const decko = { slide: slideCtx, view: viewCtx }
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<main class="h-full w-full">
	<SlideContainer>
		<ZoomLayout>
			<Slide bind:page={slideCtx.page} bind:step={slideCtx.step} />
		</ZoomLayout>

		<StepProgress />

		{#snippet outside()}
			<SlideControl />
		{/snippet}
	</SlideContainer>
</main>
