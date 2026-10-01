import { type Extension, type PostExtension, type RootContent } from '@decko/parser'

import type { Html, Image } from 'mdast'

import { asNumber, asString } from '../utils'
import { toSplitStyles } from './directive'
import { extractSteps } from './step'
import { compresseAttribute } from './strings'

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

	if (!ctx.currentSlide.local) ctx.currentSlide.local = {}
	ctx.currentSlide.local.step = Math.max(asNumber(ctx.currentSlide.local?.step, 0), stepData.maxStep)

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

		const index = parent.children.indexOf(node)
		const grandIndex = grand.children.indexOf(parent as RootContent)
		if (index === -1 || grandIndex === -1) return

		parent.children.splice(index, 1)
		grand.children.splice(grandIndex, 0, node)
		if (parent.children.length === 0) {
			const emptyIndex = grand.children.indexOf(parent as RootContent)
			grand.children.splice(emptyIndex, 1)
		}
	}
}

const HTTP_REGEX = /^(https?:)?\/\//
const HTML_SRC_REGEX = /<(?:img|video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/

export const assetsLinkExtension: Extension = (ctx) => {
	const assets = (ctx.slideCtx.extra.assets ?? {}) as Record<string, string>
	const counter = (ctx.slideCtx.extra.assetCounter ?? 0) as number

	let updateAssets = false
	if (ctx.node.type === 'image') {
		const image = ctx.node as Image
		if (HTTP_REGEX.test(image.url)) return
		if (!assets[image.url]) {
			assets[image.url] = `__assets${counter}`
		}
		image.url = assets[image.url]
		updateAssets = true
	} else if (ctx.node.type === 'html') {
		const html = ctx.node as Html
		const match = HTML_SRC_REGEX.exec(html.value)
		if (!match || HTTP_REGEX.test(match[1])) return
		if (!assets[match[1]]) {
			assets[match[1]] = `__assets${counter}`
		}
		html.value = html.value.replace(match[1], assets[match[1]])
		updateAssets = true
	}

	if (updateAssets) {
		ctx.slideCtx.extra.assets = assets
		ctx.slideCtx.extra.assetCounter = counter + 1
	}
}
