import type { Directive } from '@deckomd/parser'

import { getCustomThemes, getThemes } from '../logic/themes.js'
import { asStringArray, uniqueArray } from '../logic/utils.js'
import type { SlideData } from '../types.js'

const CUSTOM_THEME_KEY = 'customThemes'
const DEFAULT_THEME = 'default'

const BUILTIN_THEMES = ['default', 'claude', 'catppuccin', 'dracula', 'bubblegum', 'cyberpunk', 'forest', 'ocean']

const isBuiltin = (name: string) => BUILTIN_THEMES.includes(name)
const toImport = (specifier: string) => `import '${specifier}'`
const builtinPath = (name: string) => toImport(`@deckomd/decko/styles/themes/${name}.css`)

export function getThemeImports(directive: Directive): string[] {
	const customThemes = getCustomThemes(directive.customThemes) ?? {}
	const names = getThemes(directive.themes) ?? uniqueArray([...BUILTIN_THEMES, ...Object.keys(customThemes)])

	directive.themes = names
	delete directive.customThemes

	return names.flatMap((name) => {
		if (name === DEFAULT_THEME) return []
		if (customThemes[name]) return [toImport(customThemes[name])]
		if (isBuiltin(name)) return [builtinPath(name)]
		throw new Error(`Unknown theme "${name}": not a built-in theme and not listed in customThemes`)
	})
}

export function getCSSImports(data: SlideData): string[] {
	const { css } = data
	return asStringArray(css, true)?.map(toImport) ?? []
}
