import type { SlideData } from '../types'

export function getThemes(data: SlideData) {
	if (typeof data.themes === 'string') {
		return data.themes.split(',').map((m) => m.trim())
	} else if (Array.isArray(data.themes)) {
		return data.themes
	}
}

export function getExtraThemeKeys(data: SlideData) {
	if (typeof data.extraThemes === 'object' && data.extraThemes != undefined) {
		return Object.keys(data.extraThemes)
	}
}

export function getExtraThemeValue(data: SlideData) {
	if (typeof data.extraThemes === 'object' && data.extraThemes != undefined) {
		return Object.values(data.extraThemes)
	}
}
