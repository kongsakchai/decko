import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

import { findMarkdowns, readMarkdown } from './content.js'
import { resolveInsideRoot, resolveUser } from './paths.js'
import type { ResolvedPath as RootPath } from './paths.js'

export interface ResolvedPath extends RootPath {
	isFile: boolean
	isExists: boolean
}

export interface Context {
	readonly root: string
	single?: string
	data?: Record<string, string>
	markdowns(): string[]
	read(src: string): string | undefined
	resolvePath(src: string): ResolvedPath | undefined
	withSingle(single: string): Context
}

export function createContext(input: string): Context {
	const target = resolveUser(input)

	if (!existsSync(target)) {
		throw new Error(`Path does not exist: ${target}`)
	}

	const isSingle = statSync(target).isFile()
	const root = isSingle ? path.dirname(target) : target

	return {
		get root() {
			return root
		},
		single: isSingle ? path.basename(target) : undefined,
		markdowns: () => {
			return findMarkdowns(root)
		},
		read: (src) => {
			const resolved = resolveInsideRoot(root, src)
			if (!resolved) return undefined
			return readMarkdown(resolved.absolute)
		},
		resolvePath(src) {
			const resolved = resolveInsideRoot(root, src)
			if (!resolved) return undefined

			const exists = existsSync(resolved.absolute)
			const isFile = exists ? statSync(resolved.absolute).isFile() : false
			return { ...resolved, isFile, isExists: exists }
		},
		withSingle(single) {
			return { ...this, single: single }
		}
	}
}
