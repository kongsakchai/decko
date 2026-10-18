<script lang="ts">
	import { fly } from 'svelte/transition'

	import MoonIcon from '../icons/moon-icon.svelte'
	import SunIcon from '../icons/sun-icon.svelte'
	import { themeState } from '../state'

	interface Props {
		class?: string
	}

	let { class: className }: Props = $props()
</script>

<button
	onclick={themeState.toggleMode}
	title="switch-theme"
	class={['relative h-8.5 w-8.5 appearance-none overflow-hidden rounded-md', className]}
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
