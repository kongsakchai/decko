<script lang="ts">
	import type { Snippet } from 'svelte'

	import { themeState } from '../state'

	interface Props {
		light: Snippet
		dark: Snippet
	}

	let { light, dark }: Props = $props()
</script>

{#if themeState.isDark}
	{@render dark()}
{:else}
	{@render light()}
{/if}
