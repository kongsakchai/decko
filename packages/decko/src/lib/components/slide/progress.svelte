<script lang="ts">
	import { SlideContext } from '../../context/index.js'

	const slide = SlideContext.get()

	const progress = $derived(((slide.step + 1) / (slide.pageStep() + 1)) * 100)
</script>

<div class="absolute bottom-0 left-0 h-1 w-full">
	<div
		class="bg-primary h-full w-full origin-left transition-all duration-300 ease-in-out"
		style:scale="{progress}% 100%"
	></div>
</div>
