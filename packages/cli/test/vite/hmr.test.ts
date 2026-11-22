import type { Context } from '@/context'
import { checkInsideRoot, isIgnoredPath, resolveInsideRoot } from '@/paths'
import { slideHmrPlugin } from '@/vite/hmr'

import { EventEmitter } from 'node:events'
import path from 'node:path'
import { describe, expect, it, vi } from 'vitest'

const root = '/deck'

function createModule(id: string) {
	return { id, url: id, type: 'js' }
}

function createContext(): Context {
	return {
		root,
		resolvePath(file: string) {
			const relative = path.relative(root, file)
			const outside =
				!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)

			if (outside) return undefined

			return {
				absolute: file,
				relative,
				isFile: path.extname(file) !== '',
				isExists: true
			}
		}
	} as Context
}

function setup(modules: Record<string, ReturnType<typeof createModule>> = {}) {
	const watcher = Object.assign(new EventEmitter(), { add: vi.fn() })
	const graph = {
		getModuleById: vi.fn((id: string) => modules[id]),
		getModulesByFile: vi.fn(() => undefined as Set<ReturnType<typeof createModule>> | undefined),
		invalidateModule: vi.fn(),
		invalidateAll: vi.fn()
	}
	const send = vi.fn()
	const server = {
		watcher,
		hot: { send },
		environments: { client: { moduleGraph: graph } }
	}
	const plugin = slideHmrPlugin(createContext())

	;(plugin.configureServer as (server: unknown) => void)(server)

	return { watcher, graph, send }
}

describe('paths', () => {
	it('should return the absolute and relative path inside the root', () => {
		expect(resolveInsideRoot(root, '/deck/slides/intro.md')).toEqual({
			absolute: '/deck/slides/intro.md',
			relative: 'slides/intro.md'
		})
	})

	it('should resolve relative paths against the root', () => {
		expect(resolveInsideRoot(root, 'slides/intro.md')).toEqual({
			absolute: '/deck/slides/intro.md',
			relative: 'slides/intro.md'
		})
	})

	it('should treat absolute paths outside the root as web-root paths', () => {
		expect(resolveInsideRoot(root, '/image.png')).toEqual({
			absolute: '/deck/image.png',
			relative: 'image.png'
		})
	})

	it('should reject paths that escape the root', () => {
		expect(resolveInsideRoot(root, '../intro.md')).toBeUndefined()
	})

	it('should reject absolute paths outside the root', () => {
		expect(checkInsideRoot(root, '/other/intro.md')).toBeUndefined()
	})

	it('should ignore hidden directories inside the root only', () => {
		const hiddenRoot = '/home/user/.config/work'
		expect(resolveInsideRoot(hiddenRoot, `${hiddenRoot}/slides/intro.md`)).toEqual({
			absolute: `${hiddenRoot}/slides/intro.md`,
			relative: 'slides/intro.md'
		})
	})

	it('should reject hidden and generated directories', () => {
		expect(resolveInsideRoot(root, '/deck/.cache/intro.md')).toBeUndefined()
		expect(resolveInsideRoot(root, '/deck/node_modules/intro.md')).toBeUndefined()
		expect(resolveInsideRoot(root, '/deck/dist/intro.md')).toBeUndefined()
		expect(resolveInsideRoot(root, '/deck/coverage/intro.md')).toBeUndefined()
		expect(resolveInsideRoot(root, '/deck/out/intro.md')).toBeUndefined()
	})

	it('should detect ignored paths', () => {
		expect(isIgnoredPath('.cache/intro.md')).toBe(true)
		expect(isIgnoredPath('node_modules/intro.md')).toBe(true)
		expect(isIgnoredPath('dist/intro.md')).toBe(true)
		expect(isIgnoredPath('slides/intro.md')).toBe(false)
	})
})

describe('slideHmrPlugin', () => {
	it('should watch the user root', () => {
		const { watcher } = setup()

		expect(watcher.add).toHaveBeenCalledWith(root)
	})

	it('should update the markdown module when markdown changes', () => {
		const file = 'slide.md'
		const { watcher, graph, send } = setup({
			[file]: createModule(file)
		})

		watcher.emit('change', `${root}/${file}`)

		expect(graph.invalidateModule).toHaveBeenCalledTimes(1)
		expect(graph.invalidateModule).toHaveBeenCalledWith(createModule(file))
		expect(send).toHaveBeenCalledWith({
			type: 'update',
			updates: [
				{
					type: 'js-update',
					path: file,
					acceptedPath: file,
					timestamp: expect.any(Number),
					explicitImportRequired: false,
					isWithinCircularImport: false
				}
			]
		})
	})

	it('should update the explorer and style when markdown is added', () => {
		const explorer = 'decko:explorer.svelte'
		const style = 'decko:app.css'
		const { watcher, send } = setup({
			[explorer]: createModule(explorer),
			[style]: createModule(style)
		})

		watcher.emit('add', `${root}/new.md`)

		expect(send).toHaveBeenCalledWith({
			type: 'update',
			updates: [
				{
					type: 'js-update',
					path: explorer,
					acceptedPath: explorer,
					timestamp: expect.any(Number),
					explicitImportRequired: false,
					isWithinCircularImport: false
				},
				{
					type: 'js-update',
					path: style,
					acceptedPath: style,
					timestamp: expect.any(Number),
					explicitImportRequired: false,
					isWithinCircularImport: false
				}
			]
		})
	})

	it('should reload the page when a markdown file is removed', () => {
		const { watcher, graph, send } = setup()

		watcher.emit('unlink', `${root}/slide.md`)

		expect(graph.invalidateAll).toHaveBeenCalledTimes(1)
		expect(send).toHaveBeenCalledWith({ type: 'full-reload' })
	})

	it('should reload when a non-module file changes', () => {
		const { watcher, graph, send } = setup()

		watcher.emit('change', `${root}/image.png`)

		expect(graph.invalidateAll).toHaveBeenCalledTimes(1)
		expect(send).toHaveBeenCalledWith({ type: 'full-reload' })
	})

	it('should leave imported file updates to Vite', () => {
		const { watcher, graph, send } = setup()

		graph.getModulesByFile.mockReturnValue(new Set([createModule('/deck/app.svelte')]))

		watcher.emit('change', `${root}/app.svelte`)

		expect(send).not.toHaveBeenCalled()
		expect(graph.invalidateAll).not.toHaveBeenCalled()
	})

	it('should ignore files outside the root', () => {
		const { watcher, send } = setup()

		watcher.emit('change', '/other/slide.md')

		expect(send).not.toHaveBeenCalled()
	})

	it('should ignore files outside the root when removed', () => {
		const { watcher, graph, send } = setup()

		watcher.emit('unlink', '/other/slide.md')

		expect(graph.invalidateAll).not.toHaveBeenCalled()
		expect(send).not.toHaveBeenCalled()
	})
})
