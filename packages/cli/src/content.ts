import { Dirent, existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const filterMarkdown = (d: Dirent<string>) => {
	return d.isFile() && d.name.endsWith('.md')
}

const filterNonHiddenFile = (p: string) => {
	return !p.split(path.sep).some((part) => part.startsWith('.'))
}

export function findMarkdowns(root: string) {
	return readdirSync(root, { recursive: true, encoding: 'utf-8', withFileTypes: true })
		.filter(filterMarkdown)
		.map((e) => e.name)
		.filter(filterNonHiddenFile)
}

export const readMarkdown = (src: string): string | undefined => {
	if (!existsSync(src) || !src.endsWith('.md')) return undefined
	return readFileSync(src, { encoding: 'utf-8' })
}

export const resolveRoot = (root: string): string => {
	const abs = path.resolve(root)
	if (!existsSync(abs) || !statSync(abs).isDirectory()) {
		throw new Error(`Content directory not found: ${abs}`)
	}
	return abs
}
