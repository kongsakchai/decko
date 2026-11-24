<script lang="ts">
	import BurgerIcon from '../icons/burger-icon.svelte'
	import ResetIcon from '../icons/reset-icon.svelte'
	import { appearance } from '../state/appearance.svelte.js'
	import Popover from './popover.svelte'
	import ThemeSelector from './theme-selector.svelte'
	import ThemeToggle from './theme-toggle.svelte'
</script>

<div class="menu">
	<ThemeToggle class="menu-btn rounded-l-sm" />

	<div class=" border-border border-l"></div>

	<ThemeSelector class="menu-btn" />

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
			<div class="grid grid-cols-[75px_10rem_40px_34px] items-center gap-2 p-2 px-4">
				<span class=" text-sm">Font Size</span>
				<input type="range" min="0.5" max="3" step="0.1" bind:value={appearance.fontScale} />
				<span class=" text-sm">{appearance.fontScale}</span>
				<button title="reset-font" class="menu-btn rounded-sm" onclick={() => (appearance.fontScale = 1)}>
					<ResetIcon />
				</button>

				<span class="text-sm">Slide Size</span>
				<input type="range" min="0.5" max="1" step="0.01" bind:value={appearance.slideScale} />
				<span class=" text-sm">{Math.round(appearance.slideScale * 100)}%</span>

				<button title="reset-scale" class="menu-btn rounded-sm" onclick={() => (appearance.slideScale = 1)}>
					<span>
						<ResetIcon />
					</span>
				</button>
			</div>
		{/snippet}
	</Popover>
</div>
