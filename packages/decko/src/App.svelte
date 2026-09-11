<script lang="ts">
	import { Explorer, SlidePlayer } from '@decko/decko/components'

	import Slide, { slide } from './example/svelte-101.svelte.md'

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
<main class="bg-background h-dvh box-border w-full pt-1 px-6 overflow-y-scroll">
	<h1>Decko</h1>

	<Explorer files={data} />
</main>

<style lang="postcss">
	main {
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
	}
</style>
