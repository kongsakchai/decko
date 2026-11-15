<script lang="ts">
	import Appearance from './appearance-control.svelte'
	import Navigation from './navigation-control.svelte'
	import ViewContral from './view-control.svelte'
</script>

<div
	class="control absolute bottom-0 left-0 flex gap-4 p-6 opacity-0 transition-all delay-1000 duration-300 hover:opacity-100 hover:delay-0 has-[:popover-open]:opacity-100 has-[:popover-open]:delay-0"
>
	<Navigation />
	<ViewContral />
	<Appearance />
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
