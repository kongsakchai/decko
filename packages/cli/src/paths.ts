import path from 'node:path'
import { fileURLToPath } from 'url'

export const userCwd = process.cwd()

export const pkgRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

export const resolveUser = (...segments: string[]) => path.resolve(userCwd, ...segments)
