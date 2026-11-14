import { describe, expect, it } from 'vitest'

import { type NodeTree, buildTree, closeAll, getChildrenSort, toggleFolder } from './file-tree.js'

function createNode(overrides: Partial<NodeTree> = {}): NodeTree {
	return {
		name: 'node',
		children: {},
		isFolder: false,
		path: '/node',
		...overrides
	}
}

describe('buildTree', () => {
	it('should create an empty root for no files', () => {
		expect(buildTree([])).toEqual({
			name: 'root',
			children: {},
			isFolder: true,
			path: ''
		})
	})

	it('should build a tree from a flat file', () => {
		const root = buildTree(['readme.md'])

		expect(root.children['readme.md']).toEqual({
			name: 'readme.md',
			children: {},
			isFolder: false,
			path: '/readme.md'
		})
	})

	it('should build nested folders and files', () => {
		const root = buildTree(['docs/guide/intro.md', 'docs/api.md', 'image.png'])

		const docs = root.children['docs']
		expect(docs).toMatchObject({
			name: 'docs',
			isFolder: true,
			path: '/docs'
		})
		expect(docs.children['guide']).toMatchObject({
			name: 'guide',
			isFolder: true,
			path: '/docs/guide'
		})
		expect(docs.children['guide'].children['intro.md']).toMatchObject({
			name: 'intro.md',
			isFolder: false,
			path: '/docs/guide/intro.md'
		})
		expect(docs.children['api.md']).toMatchObject({
			name: 'api.md',
			isFolder: false,
			path: '/docs/api.md'
		})
		expect(root.children['image.png']).toMatchObject({
			name: 'image.png',
			isFolder: false,
			path: '/image.png'
		})
	})

	it('should reuse folders shared by multiple files', () => {
		const root = buildTree(['docs/a.md', 'docs/b.md'])

		expect(Object.keys(root.children)).toEqual(['docs'])
		expect(Object.keys(root.children['docs'].children)).toEqual(['a.md', 'b.md'])
	})

	it('should sort files without mutating the input', () => {
		const files = ['b.md', 'a.md']

		const root = buildTree(files)

		expect(Object.keys(root.children)).toEqual(['a.md', 'b.md'])
		expect(files).toEqual(['b.md', 'a.md'])
	})
})

describe('getChildrenSort', () => {
	it('should return an empty array for a node without children', () => {
		expect(getChildrenSort(createNode({ isFolder: true }))).toEqual([])
	})

	it('should sort folders before files', () => {
		const file = createNode({ name: 'file', path: '/file' })
		const folder = createNode({ name: 'folder', path: '/folder', isFolder: true })
		const node = createNode({
			isFolder: true,
			children: { file, folder }
		})
		const reversed = createNode({
			isFolder: true,
			children: { folder, file }
		})

		expect(getChildrenSort(node)).toEqual([folder, file])
		expect(getChildrenSort(reversed)).toEqual([folder, file])
	})

	it('should keep the order of nodes with the same type', () => {
		const firstFolder = createNode({ name: 'a', path: '/a', isFolder: true })
		const secondFolder = createNode({ name: 'b', path: '/b', isFolder: true })
		const firstFile = createNode({ name: 'c', path: '/c' })
		const secondFile = createNode({ name: 'd', path: '/d' })

		const folders = createNode({
			isFolder: true,
			children: { a: firstFolder, b: secondFolder }
		})
		const files = createNode({
			isFolder: true,
			children: { c: firstFile, d: secondFile }
		})

		expect(getChildrenSort(folders)).toEqual([firstFolder, secondFolder])
		expect(getChildrenSort(files)).toEqual([firstFile, secondFile])
	})
})

describe('closeAll', () => {
	it('should ignore files', () => {
		const file = createNode({ open: true })

		closeAll(file)

		expect(file.open).toBe(true)
	})

	it('should close a folder and all nested folders', () => {
		const nested = createNode({ isFolder: true, open: true })
		const folder = createNode({
			isFolder: true,
			open: true,
			children: { nested, file: createNode({ open: true }) }
		})

		closeAll(folder)

		expect(folder.open).toBe(false)
		expect(nested.open).toBe(false)
		expect(folder.children.file.open).toBe(true)
	})

	it('should close a folder without children', () => {
		const folder = createNode({ isFolder: true, open: true })

		closeAll(folder)

		expect(folder.open).toBe(false)
	})
})

describe('toggleFolder', () => {
	it('should ignore files', () => {
		const file = createNode()

		toggleFolder(file)

		expect(file.open).toBeUndefined()
	})

	it('should open a closed folder', () => {
		const child = createNode({ isFolder: true, open: false })
		const folder = createNode({
			isFolder: true,
			open: false,
			children: { child }
		})

		toggleFolder(folder)

		expect(folder.open).toBe(true)
		expect(child.open).toBe(false)
	})

	it('should close an open folder and its children', () => {
		const child = createNode({ isFolder: true, open: true })
		const folder = createNode({
			isFolder: true,
			open: true,
			children: { child }
		})

		toggleFolder(folder)

		expect(folder.open).toBe(false)
		expect(child.open).toBe(false)
	})
})
