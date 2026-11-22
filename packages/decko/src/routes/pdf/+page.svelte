<script lang="ts">
	import Slide, { data } from '../../example/example.svelte.md'
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<main id="pdf-container" class="px-auto h-full w-full overflow-auto" style:--pdf-scale={0.5}>
	<Slide page={0} step={0} showAll />
</main>

<style lang="postcss">
	#pdf-container :global(section.slide) {
		margin-left: auto;
		margin-right: auto;
		margin-top: 1rem;
		width: 1980px;
		min-height: 1080px;
		zoom: var(--pdf-scale, 1);
		overflow: hidden;

		&::before {
			background-color: var(--color-background);
			content: '';
			position: absolute;
			width: 100%;
			height: 100%;
			inset: 0;
			z-index: -2;
			user-select: none;
			top: 0;
			left: 0;
		}
	}
</style>
