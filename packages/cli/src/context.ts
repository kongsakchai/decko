import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

import { findMarkdowns, readMarkdown } from './content'

export interface Context {
	external: ExternalContext
}

export interface ExternalContext {
	readonly root: string
	markdowns(): string[]
	read(src: string): string | undefined
	resolvePath(src: string): { path: string; isFile: boolean } | undefined
	refresh(): void
}

export function createExternalContext(root: string): ExternalContext {
	let markdowns = new Set<string>()

	function loadMarkdown() {
		markdowns = new Set(findMarkdowns(root))
	}

	function read(src: string) {
		return readMarkdown(path.join(root, src))
	}

	function resolve(src: string) {
		const absolute = path.join(root, src)
		return existsSync(absolute) ? { path: absolute, isFile: statSync(absolute).isFile() } : undefined
	}

	loadMarkdown()

	return {
		get root() {
			return path.resolve(root)
		},
		markdowns: () => [...markdowns],
		refresh: () => loadMarkdown(),
		resolvePath: resolve,
		read
	}
}
