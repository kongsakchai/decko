import { type Extension, type PostExtension, type RootContent } from '@decko/parser'

import type { Html, Image, Link } from 'mdast'

import { asNumber, asString, mergeStr } from '../utils'
import { toSplitStyles } from './directive'
import { extractSteps } from './step'

export const splitContainerExtension: Extension = (ctx) => {
	if (ctx.node.type !== 'container' || !ctx.attrs.split) return

	const split = toSplitStyles(ctx.attrs)
	if (!split) return

	ctx.attrs.style = mergeStr('; ', split, ctx.attrs.style)
	delete ctx.attrs.split
}

export const stepExtension: Extension = (ctx) => {
	const stepData = extractSteps(ctx.attrs)
	if (stepData.steps.length === 0) return

	ctx.currentSlide.local ??= {}
	ctx.currentSlide.local.step = Math.max(asNumber(ctx.currentSlide.local?.step, 0), stepData.maxStep)

	const stepEntries = JSON.stringify(stepData.steps)
	ctx.attrs.svelteExpression ??= []
	const exp = ctx.attrs.svelteExpression as string[]
	exp.push(`{@attach stepper(page,${stepEntries})}`)
}

export const hoistExtension: PostExtension = {
	when: (ctx) => {
		return (
			ctx.attrs.bg != undefined ||
			!!asString(ctx.attrs.class)?.includes('absolute') ||
			!!asString(ctx.attrs.style)?.includes('absolute')
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
const HTML_HREF_REGEX = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/

const resolveURL = (assets: Record<string, string>, counter: number, url: string): [string, number] => {
	if (!url || HTTP_REGEX.test(url) || url.endsWith('.md')) return [url, counter]
	if (!assets[url]) {
		assets[url] = `__assets${counter}`
		counter++
	}
	return [`{${assets[url]}}`, counter]
}

export const assetsLinkExtension: Extension = (ctx) => {
	const extra = ctx.slideCtx.extra
	const assets = (extra.assets ?? {}) as Record<string, string>
	const counter = (extra.assetCounter ?? 0) as number

	switch (ctx.node.type) {
		case 'image': {
			const image = ctx.node as Image
			const [url, newCounter] = resolveURL(assets, counter, image.url)
			image.url = url
			ctx.slideCtx.extra.assetCounter = newCounter
			break
		}
		case 'link': {
			const link = ctx.node as Link
			const [url, newCounter] = resolveURL(assets, counter, link.url)
			link.url = url
			ctx.slideCtx.extra.assetCounter = newCounter
			break
		}
		case 'html': {
			const html = ctx.node as Html
			const src = HTML_SRC_REGEX.exec(html.value)
			if (src) {
				const [url, newCounter] = resolveURL(assets, counter, src[1])
				html.value = html.value.replace(src[1], url)
				ctx.slideCtx.extra.assetCounter = newCounter
				break
			}
			const href = HTML_HREF_REGEX.exec(html.value)
			if (href) {
				const [url, newCounter] = resolveURL(assets, counter, href[1])
				html.value = html.value.replace(href[1], url)
				ctx.slideCtx.extra.assetCounter = newCounter
				break
			}
		}
		default:
			return
	}
	ctx.slideCtx.extra.assets = assets
}
