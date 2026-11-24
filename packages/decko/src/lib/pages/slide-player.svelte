<script lang="ts">
	import { SlideContainer, SlideControl, StepProgress, ZoomLayout } from '../components/index.js'
	import { createDeckContex } from '../context/index.js'
	import { isBrowser } from '../logic/events.js'
	import { getThemes } from '../logic/themes.js'
	import { asString } from '../logic/utils.js'
	import { appearance } from '../state/appearance.svelte.js'
	import type { SlideComponent, SlideData } from '../types.js'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: Slide, width = 1280, height = 720 }: Props = $props()

	// svelte-ignore state_referenced_locally
	const { slide: slideCtx } = createDeckContex(data, { width, height })

	// svelte-ignore state_referenced_locally
	appearance.setupThemes(asString(data.theme, ''), getThemes(data.themes) ?? [])

	if (isBrowser() && window.location.hash) {
		const page = Number.parseInt(window.location.hash.slice(1))
		if (!Number.isNaN(page)) slideCtx.goto(page)
	}

	$effect(() => {
		navigation.navigate(`#${slideCtx.page}`, { history: 'replace' })
	})
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
	</SlideContainer>

	<SlideControl />
</main>
