<script lang="ts">
	import { darkModeState, fontScaleState, slideScaleState, themeState } from '@deckomd/decko/state/index.js'
	import { BurgerIcon, ResetIcon } from '../../icons/index.js'
	import DarkModeToogle from '../dark-mode-toogle.svelte'
	import Popover from '../popover.svelte'
	import ThemeSelector from '../theme-selector.svelte'
</script>

<div class="menu">
	<DarkModeToogle class="menu-btn rounded-l-sm" toggle={() => darkModeState.toggle()} isDark={darkModeState.isDark} />

	<div class=" border-border border-l"></div>

	<ThemeSelector
		class="menu-btn"
		bind:theme={themeState.current}
		themes={themeState.all}
		isDark={darkModeState.isDark}
	/>

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
				<input type="range" min="0.5" max="3" step="0.1" bind:value={fontScaleState.current} />
				<span class=" text-sm">{fontScaleState.current}</span>
				<button title="reset-font" class="menu-btn rounded-sm" onclick={() => (fontScaleState.current = 1)}>
					<ResetIcon />
				</button>

				<span class="text-sm">Slide Size</span>
				<input type="range" min="0.5" max="1" step="0.01" bind:value={slideScaleState.current} />
				<span class=" text-sm">{Math.round(slideScaleState.current * 100)}%</span>

				<button title="reset-scale" class="menu-btn rounded-sm" onclick={() => (slideScaleState.current = 1)}>
					<span>
						<ResetIcon />
					</span>
				</button>
			</div>
		{/snippet}
	</Popover>
</div>
