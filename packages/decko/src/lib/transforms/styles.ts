import type { Directive } from '@deckomd/parser'

import { asString, mergeStr } from '../logic/utils.js'

export function toStyles(directive: Directive): string {
	const style = asString(directive.style)
	const font = asString(directive.font)
	const fontMono = asString(directive.fontMono)

	return mergeStr(
		';',
		style?.endsWith(';') ? style.slice(0, -1) : style,
		font && `--font-primary:${font}`,
		fontMono && `--font-mono:${fontMono}`
	)
}
