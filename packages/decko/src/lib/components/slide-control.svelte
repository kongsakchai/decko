<script lang="ts">
	import Appearance from './appearance-control.svelte'
	import Navigation from './navigation-control.svelte'
	import ViewContral from './view-control.svelte'
</script>

<div class="control absolute bottom-10 left-10 flex gap-4">
	<Navigation />
	<ViewContral />
	<Appearance />
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "../themes/decko.css";

	.control :global {
		.menu {
			@apply bg-card border-border text-card-foreground flex gap-0.5 rounded-md border p-0.5 shadow-2xl;
		}
		.menu-btn {
			@apply hover:bg-accent hover:text-accent-foreground relative h-8.5 w-8.5 appearance-none content-center overflow-hidden rounded-md active:scale-90;
		}
	}
</style>
