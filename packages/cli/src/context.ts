import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

import { findMarkdowns, readMarkdown } from './content'
import { resolveInsideRoot, resolveUser } from './paths'

export interface ResolvedPath {
	absolute: string
	relative: string
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
			const { absolute } = resolveInsideRoot(root, src)
			if (!absolute) return undefined
			return readMarkdown(absolute)
		},
		resolvePath(src) {
			const { absolute, relative } = resolveInsideRoot(root, src)
			if (!absolute) return undefined

			const exists = existsSync(absolute)
			const isFile = exists ? statSync(absolute).isFile() : false
			return { absolute, relative, isFile, isExists: exists }
		},
		withSingle(single) {
			return { ...this, single: single }
		}
	}
}
