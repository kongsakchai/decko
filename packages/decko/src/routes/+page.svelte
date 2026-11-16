<script lang="ts">
	import { SlidePlayer } from '@deckomd/decko/pages'

	import Slide, { data } from '../example/example.svelte.md'
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<!-- <Explorer title="decko" files={data} /> -->

<SlidePlayer slide={Slide} {data} />
