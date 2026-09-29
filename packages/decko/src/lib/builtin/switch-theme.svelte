<script lang="ts">
	import { themeState } from '../state'

	import { fly } from 'svelte/transition'

	import MoonIcon from '../icons/moon-icon.svelte'
	import SunIcon from '../icons/sun-icon.svelte'

	interface Props {
		class?: string
	}

	let { class: className }: Props = $props()
</script>

<button
	onclick={themeState.toggleMode}
	title="switch-theme"
	class={[
		'text-card-foreground border-border bg-card hover:bg-accent hover:text-accent-foreground relative h-8.5 w-8.5 appearance-none overflow-hidden rounded-md border active:scale-90',
		className
	]}
>
	{#if themeState.isDark}
		<span class="absolute top-0 left-0 h-full w-full content-center" transition:fly={{ duration: 300, y: 300 }}>
			<MoonIcon />
		</span>
	{:else}
		<span class="absolute top-0 left-0 h-full w-full content-center" transition:fly={{ duration: 300, y: -300 }}>
			<SunIcon />
		</span>
	{/if}
</button>
