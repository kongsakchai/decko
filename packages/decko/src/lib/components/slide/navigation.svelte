<script lang="ts">
	import { SlideContext } from '@/context/index.js'
	import ArrowLeftIcon from '@/icons/arrow-left-icon.svelte'
	import ArrowRightIcon from '@/icons/arrow-right-icon.svelte'

	const slide = SlideContext.get()
</script>

<div class="menu">
	<button onclick={() => slide.previous()} title="previous button" class="menu-btn rounded-l-sm">
		<ArrowLeftIcon />
	</button>
	<div class=" border-border border-l"></div>
	<button title="paginate button">
		<p class="text-card-foreground m-0 min-w-21 px-2 text-center text-sm font-medium tabular-nums">
			{slide.page} / {slide.totalPage}
		</p>
	</button>
	<div class=" border-border border-l"></div>
	<button onclick={() => slide.next()} title="next button" class="menu-btn rounded-r-sm">
		<ArrowRightIcon />
	</button>
</div>
