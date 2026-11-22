import path from 'node:path'
import { fileURLToPath } from 'url'

const IGNORED_DIRS = new Set(['node_modules', 'dist', 'coverage', 'out'])

export const userCwd = process.cwd()

export const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const resolveUser = (...segments: string[]) => path.resolve(userCwd, ...segments)

export const checkInsideRoot = (root: string, absolute: string) => {
	const relative = path.relative(root, absolute)
	const outside = relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
	return outside ? {} : { absolute: resolveUser(root, relative), relative }
}

export const isIgnoredPath = (file: string) => {
	const parts = file.split(path.sep)
	return parts.some((part) => part.startsWith('.') || IGNORED_DIRS.has(part))
}

export const resolveInsideRoot = (root: string, src: string) => {
	if (isIgnoredPath(src)) return {}

	if (path.isAbsolute(src)) {
		const inside = checkInsideRoot(root, path.resolve(src))
		if (inside.absolute) return inside
	}

	const normalized = src.replace(/^[/\\]+/, '')
	const absolute = resolveUser(root, normalized)
	return checkInsideRoot(root, absolute)
}
