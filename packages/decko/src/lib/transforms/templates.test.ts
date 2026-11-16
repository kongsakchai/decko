import { describe, expect, it } from 'vitest'

import { Feature } from './feature.js'
import { pageContent, scriptContent, styleContent } from './templates.js'

describe('pageContent', () => {
	it('should create default page content', () => {
		const content = pageContent('Hello', 1)

		expect(content).toContain('{#if page === 1}')
		expect(content).toContain("class='slide'")
		expect(content).toContain("layout='default'")
		expect(content).toContain('Hello')
		expect(content).not.toContain('slide-background')
		expect(content).not.toContain('slide-page-number')
		expect(content).not.toContain('class="split"')
	})

	it('should include page options', () => {
		const content = pageContent('Hello', 2, {
			class: 'wide',
			style: 'color:red',
			layout: 'center',
			background: 'background:black',
			pageNumber: 2,
			split: '--split-col: 1fr'
		})

		expect(content).toContain("class='slide wide'")
		expect(content).toContain('style="color:red"')
		expect(content).toContain("layout='center'")
		expect(content).toContain("<div class='slide-background' style='background:black'></div>")
		expect(content).toContain('<div class="slide-page-number">2</div>')
		expect(content).toContain('<div class="split" style="--split-col: 1fr">Hello</div>')
	})
})

describe('styleContent', () => {
	it('should return empty string without styles', () => {
		expect(styleContent({ styles: [] })).toBe('')
	})

	it('should create a style block', () => {
		const content = styleContent({ styles: ['.a { color: red; }'] })

		expect(content).toContain('<style lang="postcss">')
		expect(content).toContain('@reference "tailwindcss";')
		expect(content).toContain('.a { color: red; }')
		expect(content).toContain('</style>')
	})
})

describe('scriptContent', () => {
	it('should create script content with imports and scripts', () => {
		const content = scriptContent({
			data: { title: 'Test', pages: [] },
			scripts: ['const value = 1'],
			features: new Set(),
			imports: ["import 'custom.css'"]
		})

		expect(content).toContain('export const data = {"title":"Test","pages":[]}')
		expect(content).toContain("import 'custom.css'")
		expect(content).toContain('const value = 1')
		expect(content).not.toContain('initCopyCode()')
	})

	it('should initialize copy code when the code feature is used', () => {
		const content = scriptContent({
			data: { title: 'Test', pages: [] },
			scripts: [],
			features: new Set([Feature.Code]),
			imports: []
		})

		expect(content).toContain('initCopyCode()')
	})
})
