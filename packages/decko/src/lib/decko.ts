import { createSlideParser, extractFrontmatter } from '@decko/parser'

import MagicString from 'magic-string'
import type { PreprocessorGroup } from 'svelte/compiler'

import { asNumber, asString } from './logic/utils'
import { alerts } from './transforms/alerts'
import { assetsLinkExtension, getAssetImports } from './transforms/assets'
import { toBackgroundStyles } from './transforms/background'
import { codeContainer, codeHighlighter } from './transforms/code'
import { getFeatures } from './transforms/feature'
import { resolvePaginate } from './transforms/paginate'
import { splitContainerExtension, toSplitStyles } from './transforms/split'
import { stepExtension } from './transforms/step'
import { pageContent, scriptContent, styleContent } from './transforms/templates'
import { getCSSImports, getThemeImports } from './transforms/themes'
import { hoistExtension } from './transforms/tree'
import type { Options, SlideData } from './types'

export function decko(options?: Options): PreprocessorGroup {
	const parser = createSlideParser({
		codeContainer: codeContainer,
		codeHighlighter: codeHighlighter,
		extensions: [stepExtension, splitContainerExtension, assetsLinkExtension],
		postExtension: [hoistExtension],
		customAlerts: alerts
	})

	const parse = async (markdown: string) => {
		const { body, metadata } = extractFrontmatter(markdown)
		const slide = await parser.parse(body, metadata)

		const slideData: SlideData = {
			...metadata,
			title: asString(metadata.title, 'Decko'),
			pages: []
		}

		let page = { show: false, current: 0 }
		const contents = slide.slides.map((slide) => {
			const directive = { ...slide.global, ...slide.local }
			page = resolvePaginate(directive.paginate, page.current)

			slideData.pages.push({
				page: slide.index + 1,
				note: asString(directive.note),
				step: asNumber(directive.step)
			})

			return pageContent(slide.content, slide.index + 1, {
				pageNumber: page.show ? page.current : undefined,
				class: asString(directive.class),
				style: asString(directive.style),
				layout: asString(directive.layout, 'default'),
				background: toBackgroundStyles(directive),
				split: toSplitStyles(directive)
			})
		})

		const script = scriptContent({
			data: slideData,
			scripts: slide.script,
			features: getFeatures(slide.extra),
			imports: [...getAssetImports(slide.extra), ...getThemeImports(slideData), ...getCSSImports(slideData)]
		})

		const style = styleContent({ styles: slide.style })

		return [script, ...contents, style].join('\n')
	}

	return {
		name: 'decko',
		markup: async ({ content, filename }) => {
			if (filename?.endsWith(options?.extension || '.svelte.md')) {
				const result = new MagicString(content)
				const parsed = await parse(content)

				result.update(0, content.length - 1, parsed)
				return { code: result.toString(), map: result.generateMap() }
			}
		}
	}
}
