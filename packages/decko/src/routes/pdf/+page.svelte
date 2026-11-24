<script lang="ts">
	import { PDFPreview } from '@deckomd/decko/pages'
	import Slide, { data } from '../../example/example.svelte.md'
</script>

<PDFPreview slide={Slide} {data} />
