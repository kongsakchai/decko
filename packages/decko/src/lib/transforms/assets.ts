import type { Directive, Extension } from '@deckomd/parser'

import type { Html, Image, Link } from 'mdast'

import { uniqueArray } from '../logic/utils'

const HTTP_REGEX = /^(https?:)?\/\//
const HTML_SRC_REGEX = /<(?:img|video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/
const HTML_HREF_REGEX = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/

function resolveURL(assets: Record<string, string>, counter: number, url: string): [string, number] {
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
			break
		}
		default:
			break
	}
	ctx.slideCtx.extra.assets = assets
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

export function getAssetImports(directive: Directive): string[] {
	const { assets } = directive
	if (typeof assets !== 'object' || assets === null || Array.isArray(assets)) return []

	const imports = Object.entries(assets).map(([path, name]) => {
		if (typeof name !== 'string' || !IDENTIFIER.test(name)) {
			throw new Error(`Invalid asset variable name "${String(name)}" for "${path}"`)
		}
		return `import ${name} from ${JSON.stringify(path)}`
	})
	return uniqueArray(imports)
}
