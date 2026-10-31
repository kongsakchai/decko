<script lang="ts">
	import { SlideContainer, SlideControl, StepProgress, ZoomLayout } from '../components'
	import { createSlideContext, createViewContext } from '../context'
	import { themeState } from '../state'
	import type { SlideComponent, SlideData } from '../types'

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
	const viewCtx = createViewContext({ width, height })

	if (typeof window !== 'undefined' && window.location.hash) {
		const page = Number.parseInt(window.location.hash.slice(1))
		if (!Number.isNaN(page)) slideCtx.goto(page)
	}

	// svelte-ignore state_referenced_locally
	if (typeof data.theme === 'string') {
		themeState.changeTheme(data.theme)
	}

	// $effect(() => {
	// 	slideCtx.slide = data
	// })

	// $effect(() => {
	// 	viewCtx.width = width
	// 	viewCtx.height = height
	// })

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

<style lang="postcss">
	main {
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}
</style>
