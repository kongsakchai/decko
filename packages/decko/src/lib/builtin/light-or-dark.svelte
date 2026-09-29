<script lang="ts">
	import { themeState } from '@decko/decko/state'

	import type { Snippet } from 'svelte'

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
