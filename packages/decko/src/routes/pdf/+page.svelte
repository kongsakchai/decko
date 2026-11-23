<script lang="ts">
	import { SlidePDF } from '@deckomd/decko/pages'
	import Slide, { data } from '../../example/example.svelte.md'
</script>

<SlidePDF slide={Slide} {data} />
