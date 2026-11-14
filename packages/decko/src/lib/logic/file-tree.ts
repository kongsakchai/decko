export interface NodeTree {
	name: string
	children: Record<string, NodeTree>
	isFolder: boolean
	path: string
	open?: boolean
}

export function buildTree(files: string[]): NodeTree {
	const root: NodeTree = {
		name: 'root',
		children: {},
		isFolder: true,
		path: ''
	}

	for (const file of [...files].sort()) {
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

export function getChildrenSort(node: NodeTree): NodeTree[] {
	return Object.values(node.children).sort((a, b) => {
		if (a.isFolder === b.isFolder) return 0
		return a.isFolder ? -1 : 1
	})
}

export function closeAll(node: NodeTree): void {
	if (!node.isFolder) return

	node.open = false
	for (const child of Object.values(node.children)) {
		closeAll(child)
	}
}

export function toggleFolder(node: NodeTree): void {
	if (!node.isFolder) return

	node.open = !node.open
	if (!node.open) closeAll(node)
}
