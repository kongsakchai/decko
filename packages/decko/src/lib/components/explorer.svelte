<script lang="ts">
	import { flip } from 'svelte/animate'
	import { backIn, backOut } from 'svelte/easing'
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
		console.log('effect')
	})

	function closeAll(node: NodeTree) {
		if (!node.isFolder) return
		node.open = false
		for (const n of Object.values(node.children)) {
			closeAll(n)
		}
	}

	function onClick(node: NodeTree) {
		if (node.isFolder) {
			node.open = !node.open
			if (!node.open) closeAll(node)
		} else {
			window.open(node.path, '_blank')
		}
	}
</script>

{#snippet list(node: NodeTree)}
	{#each getChildrenSort(node) as n (n.path)}
		{@render item(n)}
		{#if n.open}
			<div
				transition:slide|global={{ duration: 300, easing: n.open ? backOut : backIn }}
				class="border-border ml-3 flex flex-col gap-2 border-l-2 pl-3"
			>
				{@render list(n)}
			</div>
		{/if}
	{/each}
{/snippet}

{#snippet item(node: NodeTree)}
	<button class="text-foreground flex items-center gap-1 text-left" onclick={() => onClick(node)}>
		<div class={node.isFolder ? 'folder-icon' : 'file-icon'}></div>
		<span>{node.name}</span>
	</button>
{/snippet}

<section class="content flex w-full flex-col gap-2">
	{#if root}
		{@render list(root)}
	{/if}
	<div class="w-full h-6"></div>
</section>

<style>
	@reference "tailwindcss";
	@reference "@decko/decko/themes/decko.css";

	.folder-icon {
		@apply bg-primary h-6 w-6;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cg fill='black'%3E%3Cpath d='M14.081 7a1 1 0 0 1 .942 1.336l-1.55 4.337A2 2 0 0 1 11.592 14H3a2 2 0 0 1-.923-.227l1.51-5.66A1.5 1.5 0 0 1 5.037 7z'/%3E%3Cpath d='M4.586 2a1 1 0 0 1 .707.293L7 4h4a2 2 0 0 1 2 2H5.036a2.5 2.5 0 0 0-2.415 1.855l-1.366 5.12A2 2 0 0 1 1 12V4a2 2 0 0 1 2-2z'/%3E%3C/g%3E%3C/svg%3E")
			no-repeat center;
	}

	.file-icon {
		@apply bg-primary h-6 w-6;
		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='black' fill-rule='evenodd' d='M11 13.5H5A1.5 1.5 0 0 1 3.5 12V4A1.5 1.5 0 0 1 5 2.5h2V5a3 3 0 0 0 3 3h2.5v4a1.5 1.5 0 0 1-1.5 1.5m1.303-7a1.5 1.5 0 0 0-.242-.318L8.818 2.939a1.5 1.5 0 0 0-.318-.242V5A1.5 1.5 0 0 0 10 6.5zm.818-1.379A3 3 0 0 1 14 7.243V12a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h2.757a3 3 0 0 1 2.122.879z' clip-rule='evenodd'/%3E%3C/svg%3E")
			no-repeat center;
	}
</style>
