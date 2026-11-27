<script lang="ts">
	import { Slide } from '../components/slide/index.js'
	import type { SlideComponent, SlideData } from '../types.js'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: SlideContent, width = 1280, height = 720 }: Props = $props()
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<main class="relative h-full w-full">
	<Slide.Provider {data} {width} {height}>
		<Slide.Container>
			<Slide.ZoomContainer>
				<Slide.Content component={SlideContent} />
			</Slide.ZoomContainer>

			<Slide.Progress />
		</Slide.Container>

		<Slide.ControlRoot>
			<Slide.Navigation />
			<Slide.ViewControl />
			<Slide.AppearanceSetting />
		</Slide.ControlRoot>
	</Slide.Provider>
</main>
