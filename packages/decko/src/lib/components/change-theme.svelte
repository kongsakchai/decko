<script lang="ts">
	import PalleteIcon from '../icons/pallete-icon.svelte'
	import { themeState } from '../state'
	import Popover from './popover.svelte'

	interface Props {
		class?: string
		default?: string
		external?: string[]
		available?: string[]
	}

	let { class: className, external = [], available }: Props = $props()

	const defualtThemes = ['default', 'claude', 'catppuccin', 'dracula', 'bubblegum', 'cyberpunk', 'forest', 'ocean']
</script>

<Popover
	title="theme"
	triggerClass="relative h-8.5 w-8.5 appearance-none overflow-hidden rounded-md {className}"
	contentClass="bottom-4 bg-card text-card-foreground border-border rounded-md border p-1 flex-col"
>
	{#snippet trigger()}
		<PalleteIcon />
	{/snippet}

	{#snippet content()}
		{#each available ?? [...defualtThemes, ...external] as theme}
			<button
				class:dark={themeState.isDark}
				data-theme={theme}
				class="hover:bg-accent hover:text-accent-foreground flex min-w-30 items-center gap-2 rounded-md px-2 py-0.5"
				onclick={() => themeState.changeTheme(theme)}
			>
				<div class="grid grid-cols-2 grid-rows-2 gap-px">
					<div class="border-border bg-primary h-2 w-2 rounded-md border"></div>
					<div class="border-border bg-secondary h-2 w-2 rounded-md border"></div>
					<div class="border-border bg-accent h-2 w-2 rounded-md border"></div>
					<div class="border-border bg-background h-2 w-2 rounded-md border"></div>
				</div>
				{theme}
			</button>
		{/each}
	{/snippet}
</Popover>
