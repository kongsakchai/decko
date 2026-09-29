<script lang="ts">
	import { fly } from 'svelte/transition'

	import { useViewContext } from '../context'
	import BurgerIcon from '../icons/burger-icon.svelte'
	import MoonIcon from '../icons/moon-icon.svelte'
	import ResetIcon from '../icons/reset-icon.svelte'
	import SunIcon from '../icons/sun-icon.svelte'
	import { themeState } from '../state'
	import Popover from './popover.svelte'

	const viewContext = useViewContext()
</script>

<div class="menu">
	<button onclick={themeState.toggleMode} title="switch-theme" class="menu-btn relative rounded-l-sm">
		{#if themeState.isDark}
			<span class="absolute top-0 left-0 h-full w-full content-center" transition:fly={{ duration: 300, y: 300 }}>
				<MoonIcon />
			</span>
		{:else}
			<span
				class="absolute top-0 left-0 h-full w-full content-center"
				transition:fly={{ duration: 300, y: -300 }}
			>
				<SunIcon />
			</span>
		{/if}
	</button>

	<div class=" border-border border-l"></div>

	<Popover
		title="settings"
		triggerClass="menu-btn rounded-r-sm"
		contentClass="bottom-4 bg-card text-card-foreground border-border rounded-md border"
	>
		{#snippet trigger()}
			<BurgerIcon />
		{/snippet}

		{#snippet content()}
			<div class="grid grid-cols-[75px_10rem_40px_34px] items-center gap-2 p-2">
				<span class=" text-sm">Font Size</span>
				<input type="range" min="10" max="64" step="1" bind:value={viewContext.fontSize} />
				<span class=" text-sm">{viewContext.fontSize}px</span>
				<button title="reset-font" class="menu-btn rounded-sm" onclick={() => (viewContext.fontSize = 16)}>
					<ResetIcon />
				</button>

				<span class="text-sm">Slide Size</span>
				<input type="range" min="0.1" max="1" step="0.01" bind:value={viewContext.size} />
				<span class=" text-sm">{Math.round(viewContext.size * 100)}%</span>

				<button title="reset-scale" class="menu-btn rounded-sm" onclick={() => (viewContext.size = 1)}>
					<span>
						<ResetIcon />
					</span>
				</button>
			</div>
		{/snippet}
	</Popover>
</div>
