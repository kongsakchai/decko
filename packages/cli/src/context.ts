import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

import { findMarkdowns, readMarkdown } from './content'

export interface Context {
	external: ExternalContext
}

export interface ResolvedPath {
	path: string
	isFile: boolean
}

export interface ExternalContext {
	readonly root: string
	readonly isSingle: boolean
	markdowns(): string[]
	markdown(): string | undefined
	read(src: string): string | undefined
	resolvePath(src: string): ResolvedPath | undefined
	refresh(): void
}

export function createExternalContext(input: string): ExternalContext {
	const target = path.resolve(input)

	if (!existsSync(target)) {
		throw new Error(`Path does not exist: ${target}`)
	}

	const isSingle = statSync(target).isFile()
	const root = isSingle ? path.dirname(target) : target
	const singleFile = isSingle ? path.basename(target) : undefined

	let files: string[] = []

	const refresh = () => {
		files = singleFile ? [singleFile] : findMarkdowns(root)
	}

	function resolveInsideRoot(src: string) {
		const normalized = src.replace(/^[\/\\]+/, '')
		const absolutePath = path.resolve(root, normalized)
		const relative = path.relative(root, absolutePath)

		if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
			return undefined
		}
		return absolutePath
	}

	refresh()

	return {
		root,
		isSingle: isSingle,
		refresh,
		markdowns: () => files,
		markdown: () => files.at(0),
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
