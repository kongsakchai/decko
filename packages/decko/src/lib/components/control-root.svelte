<script lang="ts">
	import type { Snippet } from 'svelte'
	import { twMerge } from 'tailwind-merge'

	interface Props {
		class?: string
		children?: Snippet
	}

	let { class: className, children }: Props = $props()
</script>

<div class={twMerge('control', className)}>
	{@render children?.()}
</div>

<style>
	.control :global(.menu) {
		display: flex;
		gap: 0.125rem;
		padding: 0.125rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-md);
		background-color: var(--card);
		color: var(--card-foreground);
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
	}

	.control :global(.menu-btn) {
		position: relative;
		width: 2.125rem;
		height: 2.125rem;
		appearance: none;
		align-content: center;
		overflow: hidden;
		border-radius: var(--radius-md);
	}

	.control :global(.menu-btn:hover) {
		background-color: var(--accent);
		color: var(--accent-foreground);
	}

	.control :global(.menu-btn:active) {
		transform: scale(0.9);
	}
</style>
