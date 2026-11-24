<script lang="ts">
	import { PDFContainer, PDFControl } from '../components/index.js'
	import { createSlideContext, createViewContext } from '../context/index.js'
	import type { SlideComponent, SlideData } from '../types.js'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: Slide, width = 1280, height = 720 }: Props = $props()

	// svelte-ignore state_referenced_locally
	createSlideContext(data)
	// svelte-ignore state_referenced_locally
	createViewContext({ width, height })
</script>

<svelte:head>
	<title>🌱 PDF {data.title}</title>
</svelte:head>

<main class="h-full w-full">
	<PDFContainer {width} {height}>
		<Slide page={0} step={0} showAll />
	</PDFContainer>

	<PDFControl />
</main>
