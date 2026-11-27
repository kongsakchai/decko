import type { CodeContext } from '@deckomd/parser'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { CODE_SPLIT_REGEX, codeContainer, codeHighlighter } from './code.js'

const mocks = vi.hoisted(() => {
	const commit = vi.fn((code: string) => ({ current: { value: code } }))
	const highlighter = {
		getLoadedLanguages: vi.fn(() => ['javascript']),
		loadLanguage: vi.fn(async () => {}),
		codeToHast: vi.fn(() => ({ type: 'root', children: [] }))
	}

	return {
		commit,
		highlighter,
		createHighlighter: vi.fn(async () => highlighter),
		createJavaScriptRegexEngine: vi.fn(() => ({})),
		createMagicMoveMachine: vi.fn((tokenize: (code: string) => unknown) => ({
			commit: (code: string) => {
				tokenize(code)
				return commit(code)
			}
		})),
		codeToKeyedTokens: vi.fn(() => []),
		compressToBase64: vi.fn(() => 'compressed'),
		render: vi.fn(() => ({ svg: '<svg>graph TD</svg>' }))
	}
})

vi.mock('shiki', () => ({ createHighlighter: mocks.createHighlighter }))
vi.mock('shiki/engine/javascript', () => ({
	createJavaScriptRegexEngine: mocks.createJavaScriptRegexEngine
}))
vi.mock('@shikijs/magic-move/core', () => ({
	createMagicMoveMachine: mocks.createMagicMoveMachine,
	codeToKeyedTokens: mocks.codeToKeyedTokens
}))
vi.mock('@shikijs/transformers', () => ({
	transformerMetaHighlight: vi.fn(() => ({})),
	transformerMetaWordHighlight: vi.fn(() => ({})),
	transformerNotationDiff: vi.fn(() => ({})),
	transformerNotationErrorLevel: vi.fn(() => ({})),
	transformerNotationFocus: vi.fn(() => ({})),
	transformerNotationHighlight: vi.fn(() => ({})),
	transformerNotationWordHighlight: vi.fn(() => ({}))
}))
vi.mock('lz-string', () => ({
	default: { compressToBase64: mocks.compressToBase64 }
}))
vi.mock('pele', () => ({ render: mocks.render }))

function createContext(overrides: Partial<CodeContext> = {}): CodeContext {
	const slideCtx: CodeContext['slideCtx'] = {
		slides: [{ breakIndex: 0, global: {} }],
		style: [],
		script: [],
		extra: {},
		heading: []
	}

	return {
		lang: 'javascript',
		code: 'const a = 1',
		meta: '',
		attrs: {},
		slideCtx,
		slide: slideCtx.slides[0],
		...overrides
	}
}

describe('codeContainer', () => {
	it('should create a mermaid container', async () => {
		const attrs = { class: 'language-mermaid extra' }
		const result: any = await codeContainer(createContext({ lang: 'mermaid', attrs }))

		expect(attrs.class).toBe(' extra')
		expect(result).toEqual({
			type: 'container',
			data: { hName: 'div', hProperties: attrs, hChildren: [] },
			children: []
		})
	})

	it('should only remove the mermaid language class', async () => {
		const attrs = {
			class: 'language-mermaid',
			svelteExpression: ['existing']
		}
		await codeContainer(createContext({ lang: 'mermaid', attrs }))

		expect(attrs.class).toBe('')
		expect(attrs.svelteExpression).toEqual(['existing'])
	})

	it('should create a code container', async () => {
		const attrs = { class: 'language-js' }
		const result: any = await codeContainer(createContext({ lang: 'js', attrs }))

		expect(result.data.hProperties).toBe(attrs)
		expect(result.data.hChildren[0].value).toContain('copy code button')
		expect(result.data.hChildren[1]).toEqual({
			type: 'raw',
			value: '<span class="lang">js</span>'
		})
	})
})

describe('codeHighlighter', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mocks.highlighter.getLoadedLanguages.mockReturnValue(['javascript'])
		mocks.highlighter.loadLanguage.mockResolvedValue(undefined)
		mocks.highlighter.codeToHast.mockReturnValue({ type: 'root', children: [] })
		mocks.compressToBase64.mockReturnValue('compressed')
		mocks.commit.mockImplementation((code: string) => ({ current: { value: code } }))
	})

	it('should render mermaid diagrams', async () => {
		const ctx = createContext({ lang: 'mermaid', code: 'graph TD' })

		const result = await codeHighlighter(ctx)

		expect(mocks.render).toHaveBeenCalledWith('graph TD')
		expect(result).toEqual({ type: 'raw', value: '<svg>graph TD</svg>' })
		expect(mocks.highlighter.codeToHast).not.toHaveBeenCalled()
	})

	it('should highlight code with a loaded language', async () => {
		const ctx = createContext()

		await codeHighlighter(ctx)

		expect(mocks.highlighter.loadLanguage).not.toHaveBeenCalled()
		expect(mocks.highlighter.codeToHast).toHaveBeenCalledWith(
			'const a = 1',
			expect.objectContaining({
				lang: 'javascript',
				meta: { __raw: '' },
				defaultColor: false,
				themes: { light: 'github-light', dark: 'github-dark' }
			})
		)
		expect(ctx.slideCtx.extra.hasCode).toBe(true)
	})

	it('should load an unloaded language', async () => {
		mocks.highlighter.getLoadedLanguages.mockReturnValueOnce([])
		const ctx = createContext({ lang: 'rust' })

		await codeHighlighter(ctx)

		expect(mocks.highlighter.loadLanguage).toHaveBeenCalledWith('rust')
		expect(ctx.lang).toBe('rust')
	})

	it('should fall back to plaintext when language loading fails', async () => {
		mocks.highlighter.getLoadedLanguages.mockReturnValueOnce([])
		mocks.highlighter.loadLanguage.mockRejectedValueOnce(new Error('load failed'))
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
		const ctx = createContext({ lang: 'unknown' })

		await codeHighlighter(ctx)

		expect(warn).toHaveBeenCalledWith(expect.stringContaining('Failed to load language: unknown'))
		expect(ctx.lang).toBe('plaintext')
		expect(mocks.highlighter.codeToHast).toHaveBeenCalledWith(
			'const a = 1',
			expect.objectContaining({ lang: 'plaintext' })
		)
		warn.mockRestore()
	})

	it('should create magic move steps', async () => {
		const ctx = createContext({
			lang: 'javascript',
			code: 'line1\n>>>>>\nline2',
			attrs: { step: '1', at: '2' }
		})

		const result = await codeHighlighter(ctx)

		expect(mocks.createMagicMoveMachine).toHaveBeenCalledOnce()
		expect(mocks.commit).toHaveBeenNthCalledWith(1, 'line1')
		expect(mocks.commit).toHaveBeenNthCalledWith(2, 'line2')
		expect(ctx.slide.directive).toEqual({ step: 3 })
		expect(mocks.compressToBase64).toHaveBeenCalledWith(JSON.stringify([{ value: 'line1' }, { value: 'line2' }]))
		expect(result).toEqual({
			type: 'element',
			tagName: 'CodeStepBlock',
			properties: { code: 'compressed', start: 2 },
			children: []
		})
	})

	it('should default the magic move start to zero', async () => {
		const ctx = createContext({ code: 'line1', attrs: { step: '1' } })

		const result: any = await codeHighlighter(ctx)

		expect(ctx.slide.directive).toEqual({ step: 0 })
		expect(result.properties.start).toBe(0)
	})

	it('should ignore an invalid at attribute', async () => {
		const ctx = createContext({ code: 'line1', attrs: { step: '1', at: 'abc' } })

		const result: any = await codeHighlighter(ctx)

		expect(ctx.slide.directive).toEqual({ step: 0 })
		expect(result.properties.start).toBe(0)
	})

	it('should split code with the step separator', () => {
		expect('a\n>>>>>\nb'.split(CODE_SPLIT_REGEX)).toEqual(['a\n', '\nb'])
	})
})
