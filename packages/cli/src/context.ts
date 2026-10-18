import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

import { findMarkdowns, readMarkdown } from './content'

export interface ResolvedPath {
	path: string
	isFile: boolean
}

export interface Context {
	readonly root: string
	markdown?: string
	data?: Record<string, string>
	markdowns(): string[]
	read(src: string): string | undefined
	resolvePath(src: string): ResolvedPath | undefined
}

export function createContext(input: string): Context {
	const target = path.resolve(input)

	if (!existsSync(target)) {
		throw new Error(`Path does not exist: ${target}`)
	}

	const isSingle = statSync(target).isFile()
	const root = isSingle ? path.dirname(target) : target

	function resolveInsideRoot(src: string) {
		const normalized = src.replace(/^[/\\]+/, '')
		const absolutePath = path.resolve(root, normalized)
		const relative = path.relative(root, absolutePath)

		if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
			return undefined
		}
		return absolutePath
	}

	return {
		root,
		markdown: isSingle ? path.basename(target) : undefined,
		markdowns: () => {
			return findMarkdowns(root)
		},
		read: (src) => {
			const absolute = resolveInsideRoot(src)
			if (!absolute) return undefined
			return readMarkdown(absolute)
		},
		resolvePath(src) {
			const absolute = resolveInsideRoot(src)
			if (!absolute || !existsSync(absolute)) return undefined
			return { path: absolute, isFile: statSync(absolute).isFile() }
		}
	}
}
