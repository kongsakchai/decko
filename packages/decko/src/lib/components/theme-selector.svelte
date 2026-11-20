<script lang="ts">
	import { useSlideContext } from '../context/slide.svelte.js'
	import PalleteIcon from '../icons/pallete-icon.svelte'
	import { getThemes, resolveTheme } from '../logic/themes.js'
	import { asString } from '../logic/utils.js'
	import { appearance } from '../state/index.js'
	import Popover from './popover.svelte'

	interface Props {
		class?: string
	}

	let { class: className }: Props = $props()

	const slideContex = useSlideContext()

	const themes = getThemes(slideContex.slide.themes)

	let initValue = $state(resolveTheme(asString(slideContex.slide.theme, appearance.theme), themes))

	$effect(() => {
		document.documentElement.dataset.theme = initValue || appearance.theme
	})
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
		{#each themes as theme (theme)}
			<button
				class:dark={appearance.isDark}
				data-theme={theme}
				class:bg-accent={theme === (initValue || appearance.theme)}
				class:text-accent-foreground={theme === appearance.theme}
				class="hover:bg-accent hover:text-accent-foreground box-content flex min-w-30 items-center gap-2 rounded-md px-2 py-0.5"
				onclick={() => {
					appearance.theme = theme
					initValue = ''
				}}
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
