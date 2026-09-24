<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		title: string
		triggerClass?: string
		contentClass?: string
		position?: string
		trigger: Snippet
		content: Snippet
	}

	let {
		title,
		triggerClass,
		contentClass: popupClass,
		trigger,
		content: popup,
		position = 'top center'
	}: Props = $props()
</script>

<button {title} popovertarget="{title}-panel" class={[triggerClass]} style:anchor-name="--anchor-{title}">
	{@render trigger()}
</button>

<div
	popover
	id="{title}-panel"
	class={['panel', popupClass]}
	style:position-anchor="--anchor-{title}"
	style:position-area={position}
>
	{@render popup()}
</div>

<style lang="postcss">
	.panel {
		position: fixed;
		display: flex;
		scale: 100%;
		opacity: 1;
		transition: all 300ms cubic-bezier(0.68, -0.6, 0.32, 1.6);

		&:not(:popover-open) {
			display: none;
			scale: 80%;
			opacity: 0.8;
			transition-behavior: allow-discrete;
		}

		@starting-style {
			&:popover-open {
				scale: 80%;
				opacity: 0.8;
			}
		}
	}
</style>
