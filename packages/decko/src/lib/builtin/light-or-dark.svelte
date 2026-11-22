<script lang="ts">
	import type { Snippet } from 'svelte'

	import { appearance } from '../state/index.js'

	interface Props {
		light: Snippet
		dark: Snippet
	}

	let { light, dark }: Props = $props()
</script>

{#if appearance.isDark}
	{@render dark()}
{:else}
	{@render light()}
{/if}
