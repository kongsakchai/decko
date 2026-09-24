<script lang="ts">
	import Slide, { slide } from './example/example.svelte.md'
	import SlidePlayer from './lib/components/slide-player.svelte'

	const data = [
		'03-resource/linux-check-port.md',
		'03-resource/kubernetes/Kubernetes.md',
		'03-resource/kubernetes/Kind ใน Kubernetes.md',
		'03-resource/kubernetes/Config ที่เคยใช้.md',
		'03-resource/kubernetes/Kustomize.md',
		'03-resource/kubernetes/Learn Kubernetes.md',
		'03-resource/HTML น่ารู้.md',
		'03-resource/Design System.md',
		'03-resource/SQL Logical Order.md',
		'03-resource/punctuation.md',
		'03-resource/godot/Multiple resolutions.md',
		'03-resource/godot/Physics.md',
		'03-resource/godot/PhysicsBody2D.md',
		'makefile',
		'note.md',
		'05-slide/marp.md',
		'05-slide/svelte-101.md',
		'05-slide/dev_environment.md',
		'node_modules/ms/license.md',
		'node_modules/ms/index.js',
		'node_modules/ms/readme.md',
		'node_modules/ms/package.json',
		'node_modules/globrex/license',
		'node_modules/globrex/index.js',
		'node_modules/globrex/readme.md',
		'node_modules/globrex/package.json',
		'node_modules/tsconfck/types/index.d.ts',
		'node_modules/tsconfck/types/index.d.ts.map',
		'node_modules/tsconfck/LICENSE'
	]
</script>

<svelte:head>
	<title>{slide.title}</title>
</svelte:head>
<!-- <main class="bg-background box-border h-dvh w-full overflow-y-scroll px-6 pt-1 transition-all duration-500">
	<section class="flex items-center justify-between">
		<h1>Decko</h1>

		<SwitchTheme />
	</section>

	<Explorer files={data} />
</main> -->

<main class="h-full w-full">
	<SlidePlayer slide={Slide} data={slide} />
</main>

<style lang="postcss">
	main {
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}
</style>
