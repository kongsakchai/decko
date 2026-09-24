<script lang="ts">
	import type { Snippet } from 'svelte'

	interface Props {
		title: string
		triggerClass?: string
		popupClass?: string
		trigger: Snippet
		popup: Snippet
	}

	let { title, triggerClass, popupClass, trigger, popup }: Props = $props()
</script>

<button {title} popovertarget="{title}-popup" class={[triggerClass]} style:anchor-name="--anchor-{title}">
	{@render trigger()}
</button>

<div popover id="{title}-popup" class={['popup',popupClass]} style:position-anchor="--anchor-{title}">
	{@render popup()}
</div>

<style lang="postcss">
	.popup {
		position: fixed;
		position-area: top center;

		&[popover] {
			display: none;
		}

		&[popover]:popover-open {
			display: flex;
		}
	}
</style>
