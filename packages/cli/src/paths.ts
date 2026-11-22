import path from 'node:path'
import { fileURLToPath } from 'url'

const IGNORED_DIRS = new Set(['node_modules', 'dist', 'coverage', 'out'])

export interface ResolvedPath {
	absolute: string
	relative: string
}

export const userCwd = process.cwd()

export const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const resolveUser = (...segments: string[]) => path.resolve(userCwd, ...segments)

export const checkInsideRoot = (root: string, absolute: string): ResolvedPath | undefined => {
	const relative = path.relative(root, absolute)
	const outside = relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
	return outside ? undefined : { absolute: resolveUser(root, relative), relative }
}

export const isIgnoredPath = (file: string) => {
	const parts = file.split(/[\\/]+/)
	return parts.some((part) => part.startsWith('.') || IGNORED_DIRS.has(part))
}

export const resolveInsideRoot = (root: string, src: string): ResolvedPath | undefined => {
	if (path.isAbsolute(src)) {
		const inside = checkInsideRoot(root, path.resolve(src))
		if (inside) {
			return isIgnoredPath(inside.relative) ? undefined : inside
		}
	}

	const normalized = src.replace(/^[/\\]+/, '')
	const absolute = resolveUser(root, normalized)
	const inside = checkInsideRoot(root, absolute)
	if (!inside || isIgnoredPath(inside.relative)) return undefined

	return inside
}
