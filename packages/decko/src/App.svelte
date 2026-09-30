<script lang="ts">
	import Slide, { slide } from './example/example.svelte.md'
	import { Explorer } from './lib/page'

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

	console.log(Slide, slide)
</script>

<svelte:head>
	<title>{slide.title}</title>
</svelte:head>

<Explorer title="decko" files={data} />

<!-- <SlidePlayer slide={Slide} data={slide} /> -->
