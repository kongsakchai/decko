<script lang="ts">
	import Appearance from './appearancer.svelte'
	import Navigation from './navigation.svelte'
	import ViewContral from './view-control.svelte'
</script>

<div class="controller absolute bottom-10 left-10 flex gap-4">
	<Navigation />
	<ViewContral />
	<Appearance />
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@decko/decko/themes/decko.css";

	.controller :global {
		.menu {
			@apply bg-card border-border text-card-foreground flex gap-0.5 rounded-md border p-0.5 shadow-2xl;
		}
		.menu-btn {
			@apply hover:bg-accent hover:text-accent-foreground h-8.5 w-8.5 appearance-none content-center;
		}
	}
</style>
