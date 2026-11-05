<script lang="ts">
	import { SlidePlayer } from '@decko/decko/pages'

	import Slide, { slide } from './example/example.svelte.md'
</script>

<svelte:head>
	<title>{slide.title}</title>
</svelte:head>

<!-- <Explorer title="decko" files={data} /> -->

<SlidePlayer slide={Slide} data={slide} />
