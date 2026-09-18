<script lang="ts">
	import { backOut } from 'svelte/easing'
	import { SvelteMap } from 'svelte/reactivity'
	import { slide } from 'svelte/transition'

	interface Props {
		files: string[]
	}

	interface NodeTree {
		name: string
		children: Record<string, NodeTree>
		isFolder: boolean
		path: string
		open?: boolean
	}

	let { files }: Props = $props()

	function buildTree(files: string[]) {
		const root: NodeTree = {
			name: 'root',
			children: {},
			isFolder: true,
			path: ''
		}
		for (const file of files.sort()) {
			console.log(file)
			let parent = root
			const parts = file.split('/')
			for (const [i, name] of parts.entries()) {
				let child = parent.children[name]
				if (!child) {
					child = {
						name,
						children: {},
						isFolder: i < parts.length - 1,
						path: parent.path ? `${parent.path}/${name}` : `/${name}`
					}
					parent.children[name] = child
				}
				parent = child
			}
		}
		return root
	}

	function getChildrenSort(t: NodeTree) {
		return Object.values(t.children).sort((a, b) => {
			if (a.isFolder && b.isFolder) return 0
			if (a.isFolder) return -1
			return 1
		})
	}

	let root = $state<NodeTree>()

	$effect(() => {
		if (files.length === 0) return
		root = buildTree(files)
	})
</script>

{#snippet list(node: NodeTree)}
	{#each getChildrenSort(node) as n, i (i)}
		{#if n.isFolder}
			{@render folder(n)}
		{:else}
			{@render file(n)}
		{/if}
	{/each}
{/snippet}

{#snippet folder(node: NodeTree)}
	<button
		class="flex items-center text-left gap-1"
		transition:slide|global={{ duration: 320, easing: backOut }}
		onclick={() => (node.open = !node.open)}
	>
		<div class="folder-icon h-6 w-6 gap-1"></div>
		<span>{node.name}</span>
	</button>
	{#if node.open}
		<div class="pl-3">
			<div class="flex flex-col border-l border-border pl-3 gap-1">
				{@render list(node)}
			</div>
		</div>
	{/if}
{/snippet}

{#snippet file(node: NodeTree)}
	<a
		class="flex items-center text-left"
		transition:slide|global={{ duration: 320, easing: backOut }}
		href={node.path}
	>
		<div class="file-icon h-6 w-6"></div>
		<span>{node.name}</span>
	</a>
{/snippet}

<section class="flex h-full w-full flex-col overflow-scroll gap-1">
	{#if root}
		{@render list(root)}
	{/if}
</section>

<style>
	@reference "tailwindcss";
	@reference "@decko/decko/themes/decko.css";

	.folder-icon {
		@apply bg-primary;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg fill='black'%3E%3Cpath d='M14.081 7a1 1 0 0 1 .942 1.336l-1.55 4.337A2 2 0 0 1 11.592 14H3a2 2 0 0 1-.923-.227l1.51-5.66A1.5 1.5 0 0 1 5.037 7z'/%3E%3Cpath d='M4.586 2a1 1 0 0 1 .707.293L7 4h4a2 2 0 0 1 2 2H5.036a2.5 2.5 0 0 0-2.415 1.855l-1.366 5.12A2 2 0 0 1 1 12V4a2 2 0 0 1 2-2z'/%3E%3C/g%3E%3C/svg%3E")
			no-repeat center;
	}

	.file-icon {
		@apply bg-primary/80;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg fill='black'%3E%3Cpath d='M7 4a3 3 0 0 0 3 3h3v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h2z'/%3E%3Cpath d='M13 6h-3a2 2 0 0 1-2-2V1z'/%3E%3C/g%3E%3C/svg%3E")
			no-repeat center;
	}
</style>
