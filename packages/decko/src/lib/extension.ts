import { type Attribute, type Extension, type Node, type PostExtension, type RootContent } from '@decko/parser'

import lz from 'lz-string'

import { toSplitStyles } from './directive'
import { extractSteps } from './step'
import { asNumber, asString } from './utils'

export const splitContainerExtension: Extension = (ctx) => {
	if (ctx.node.type !== 'container' || !ctx.attribute.split) return

	const split = toSplitStyles(ctx.attribute)
	if (!split) return

	ctx.attribute.style = [split, ctx.attribute.style].filter(Boolean).join(';')
	delete ctx.attribute.split
}

export const stepExtension: Extension = (ctx) => {
	const stepData = extractSteps(ctx.attribute)
	if (stepData.steps.length === 0) return

	if (!ctx.slideData.local) ctx.slideData.local = {}
	ctx.slideData.local.step = Math.max(asNumber(ctx.slideData.local?.step, 0), stepData.maxStep)

	const stepEntries = JSON.stringify(stepData.steps)
	compresseAttribute(ctx.attribute, `{@attach stepper(page,${stepEntries})}`)
}

export const hoistExtension: PostExtension = {
	when: (ctx) => {
		return (
			ctx.attribute.bg !== undefined ||
			!!asString(ctx.attribute.class)?.includes('absolute') ||
			!!asString(ctx.attribute.style)?.includes('absolute')
		)
	},
	extension: (ctx) => {
		if (ctx.parents.length < 2) return

		const node = ctx.node as RootContent
		const parent = ctx.parents[ctx.parents.length - 1]
		const grand = ctx.parents[ctx.parents.length - 2]

		const index = (parent.children).indexOf(node)
		const grandIndex = (grand.children).indexOf(parent as RootContent)
		if (index === -1 || grandIndex === -1) return

		parent.children.splice(index, 1)
		grand.children.splice(grandIndex, 0, node)
		if (parent.children.length === 0) {
			const emptyIndex = grand.children.indexOf(parent as RootContent)
			grand.children.splice(emptyIndex, 1)
		}
	}
}

export function compresseAttribute(attrs: Attribute, ...add: string[]) {
	const compressed = add.map((s) => lz.compressToBase64(s))
	attrs['@compressed'] = [asString(attrs['@compressed'], ''), ...compressed].filter(Boolean).join(' ')
}

export function decompresseContent(content: string) {
	for (const match of content.matchAll(/@compressed="(.*?)"/g)) {
		const decompress = match[1].split(' ').map((s) => lz.decompressFromBase64(s))
		content = content.replaceAll(match[0], decompress.join(' '))
	}
	return content
}
