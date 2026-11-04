import { type Directive, type Extension } from '@deckomd/parser'

import { mergeStr } from '../logic/utils'

function toSplitValue(value: string): string {
	const parts = value.trim().split(/\s+/).filter(Boolean)

	if (parts.length === 1 && /^\d+$/.test(parts[0])) {
		return `repeat(${parts[0]},1fr)`
	}

	return parts.map((p) => (/^\d+$/.test(p) ? `${p}fr` : p)).join(' ')
}

export function toSplitStyles(directive: Directive): string | undefined {
	const split = directive.split
	const gap = directive['split-gap'] ? `gap: ${directive['split-gap']}` : ''

	if (typeof split === 'number') {
		const colStyle = `--split-col: repeat(${split},1fr)`
		return mergeStr('; ', directive.style, colStyle, gap) || undefined
	}

	if (typeof split === 'string') {
		const [colRaw, rowRaw] = split.split(',')

		const colStyle = colRaw?.trim() ? `--split-col: ${toSplitValue(colRaw)}` : ''
		const rowStyle = rowRaw?.trim() ? `--split-row: ${toSplitValue(rowRaw)}` : ''

		const styles = mergeStr('; ', directive.style, colStyle, rowStyle, gap)
		return styles || undefined
	}

	return undefined
}

export const splitContainerExtension: Extension = (ctx) => {
	if (ctx.node.type !== 'container' || !ctx.attrs.split) return

	const split = toSplitStyles(ctx.attrs)
	if (!split) return

	ctx.attrs.style = mergeStr('; ', split, ctx.attrs.style)
	delete ctx.attrs.split
}
