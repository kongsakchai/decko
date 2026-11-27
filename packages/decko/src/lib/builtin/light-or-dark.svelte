<script lang="ts">
	import type { Snippet } from 'svelte'

	import { darkModeState } from '@/state/index.js'

	interface Props {
		light: Snippet
		dark: Snippet
	}

	let { light, dark }: Props = $props()
</script>

{#if darkModeState.isDark}
	{@render dark()}
{:else}
	{@render light()}
{/if}
