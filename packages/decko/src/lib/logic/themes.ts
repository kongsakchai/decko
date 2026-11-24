import { asStringArray } from './utils.js'

export function getThemes(themes: unknown): string[] | undefined {
	return asStringArray(themes, true)
}

export function resolveTheme(requested: string, available?: string[]) {
	if (available?.includes(requested)) return requested
	return available?.[0] ?? 'default'
}

export function getCustomThemes(customThemes: unknown): Record<string, string> | undefined {
	if (typeof customThemes !== 'object' || customThemes === null || Array.isArray(customThemes)) {
		return undefined
	}
	const filtered = Object.entries(customThemes).filter(([, value]) => typeof value === 'string')
	return Object.fromEntries(filtered)
}
