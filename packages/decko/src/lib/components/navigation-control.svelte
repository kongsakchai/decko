<script lang="ts">
	import { useSlideContext } from '../context'
	import ArrowLeftIcon from '../icons/arrow-left-icon.svelte'
	import ArrowRightIcon from '../icons/arrow-right-icon.svelte'

	const slideCtx = useSlideContext()
</script>

<div class="menu">
	<button onclick={() => slideCtx.previous()} title="previous button" class="menu-btn rounded-l-sm">
		<ArrowLeftIcon />
	</button>
	<div class=" border-border border-l"></div>
	<button title="paginate button">
		<p class="text-card-foreground m-0 min-w-21 px-2 text-center text-sm font-medium tabular-nums">
			{slideCtx.page} / {slideCtx.totalPage}
		</p>
	</button>
	<div class=" border-border border-l"></div>
	<button onclick={() => slideCtx.next()} title="next button" class="menu-btn rounded-r-sm">
		<ArrowRightIcon />
	</button>
</div>
