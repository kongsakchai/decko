import type { Directive, Extension } from '@deckomd/parser'

import type { Html, Image, Link } from 'mdast'

import { uniqueArray } from '../utils.js'

const HTTP_REGEX = /^(https?:)?\/\//
const HTML_SRC_REGEX = /<(?:img|video|source)\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/
const HTML_HREF_REGEX = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/

function isExternalURL(url: string): boolean {
	if (HTTP_REGEX.test(url)) return true // http:, https:, //host
	try {
		new URL(url) // mailto:, tel:, data:, etc.
		return true
	} catch {
		return false
	}
}

function resolveURL(assets: Record<string, string>, url: string): string {
	if (!url || isExternalURL(url) || url.endsWith('.md')) return url
	if (!assets[url]) {
		assets[url] = `__assets${Object.keys(assets).length}`
	}
	return `{${assets[url]}}`
}

export const assetsLinkExtension: Extension = (ctx) => {
	const extra = ctx.slideCtx.extra
	const assets = (extra.assets ?? {}) as Record<string, string>

	switch (ctx.node.type) {
		case 'image': {
			const image = ctx.node as Image
			image.url = resolveURL(assets, image.url)
			break
		}
		case 'link': {
			const link = ctx.node as Link
			link.url = resolveURL(assets, link.url)
			break
		}
		case 'html': {
			const html = ctx.node as Html
			const src = HTML_SRC_REGEX.exec(html.value)
			if (src) {
				const url = resolveURL(assets, src[1])
				html.value = html.value.replace(src[1], url)
				break
			}
			const href = HTML_HREF_REGEX.exec(html.value)
			if (href) {
				const url = resolveURL(assets, href[1])
				html.value = html.value.replace(href[1], url)
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
