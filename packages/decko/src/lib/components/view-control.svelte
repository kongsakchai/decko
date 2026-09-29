<script lang="ts">
	import { scale } from 'svelte/transition'

	import { useViewContext } from '../context'
	import FullscreenIcon from '../icons/fullscreen-icon.svelte'
	import NormalscreenIcon from '../icons/normalscreen-icon.svelte'
	import ZoomIcon from '../icons/zoom-icon.svelte'
	import Popover from './popover.svelte'

	let fullscreen = $state(!!document.fullscreenElement)

	const viewContext = useViewContext()

	function onFullscreen() {
		if (!document.fullscreenElement) {
			fullscreen = true
			document.documentElement.requestFullscreen()
		} else {
			fullscreen = false
			document.exitFullscreen()
		}
	}
</script>

<div class="menu">
	<button onclick={onFullscreen} title="fullscreen" class="menu-btn rounded-l-sm">
		{#if fullscreen}
			<span class="absolute top-0 left-0 h-full w-full content-center" transition:scale={{ opacity: 80 }}
				><NormalscreenIcon /></span
			>
		{:else}
			<span class="absolute top-0 left-0 h-full w-full content-center" transition:scale={{ opacity: 80 }}
				><FullscreenIcon /></span
			>
		{/if}
	</button>

	<div class=" border-border border-l"></div>

	<Popover
		title="zoom"
		triggerClass="menu-btn rounded-r-sm"
		contentClass="bg-card text-card-foreground border-border rounded-md border p-2 px-4 bottom-4"
	>
		{#snippet trigger()}
			<ZoomIcon />
		{/snippet}

		{#snippet content()}
			<input type="range" class="w-40" min="1" max="3" step="0.01" bind:value={viewContext.zoom} />
			<span class="w-10 text-right text-sm">{Math.round(viewContext.zoom * 100)}%</span>
		{/snippet}
	</Popover>
</div>
