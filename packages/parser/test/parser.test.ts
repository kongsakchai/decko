import { describe, expect, it } from 'vitest'

import { createSlideParser, extractFrontmatter } from '../src/parser'

describe('createSlideParser', () => {
	it('should parse markdown into a single slide', async () => {
		const parser = createSlideParser()
		const result = await parser.parse('# Hello')

		expect(result.slides).toHaveLength(1)
		expect(result.slides[0]).toMatchObject({ index: 0, title: undefined })
		expect(result.slides[0].content).toContain('<h1>Hello</h1>')
		expect(result.slides[0].global).toEqual({})
		expect(result.slides[0].local).toBeUndefined()
		expect(result.script).toEqual([])
		expect(result.style).toEqual([])
		expect(result.extra).toEqual({})
	})

	it('should split slides by page break', async () => {
		const parser = createSlideParser()
		const result = await parser.parse('# One\n\n---\n\n# Two')

		expect(result.slides).toHaveLength(2)
		expect(result.slides[0].content).toContain('<h1>One</h1>')
		expect(result.slides[1].content).toContain('<h1>Two</h1>')
		expect(result.slides[1].global).toEqual({})
	})

	it('should pass global data to every slide', async () => {
		const parser = createSlideParser()
		const result = await parser.parse('# One\n\n---\n\n# Two', { theme: 'dark' })

		expect(result.slides[0].global).toEqual({ theme: 'dark' })
		expect(result.slides[1].global).toEqual({ theme: 'dark' })
	})

	it('should extract script and style', async () => {
		const parser = createSlideParser()
		const result = await parser.parse(
			'<script>\nconst a = 1\n</script>\n\n<style>\n.a { color: red }\n</style>'
		)

		expect(result.script).toEqual(['\nconst a = 1\n'])
		expect(result.style).toEqual(['\n.a { color: red }\n'])
	})

	it('should apply local directive', async () => {
		const parser = createSlideParser()
		const result = await parser.parse('<!-- title: Local -->\n\n# Hi')

		expect(result.slides[0].local).toEqual({ title: 'Local' })
	})

	it('should pass options to transformers', async () => {
		const parser = createSlideParser({ customAlerts: { decko: { title: 'Decko' } } })
		const result = await parser.parse('> [!decko]\n> Hello')

		expect(result.slides[0].content).toContain('alert="decko"')
		expect(result.slides[0].content).toContain('Decko')
	})
})

describe('extractFrontmatter', () => {
	it('should extract metadata and body', () => {
		const result = extractFrontmatter('---\ntitle: Hello\ntheme: dark\n---\n\n# Slide')

		expect(result.metadata).toEqual({ title: 'Hello', theme: 'dark' })
		expect(result.body).toBe('# Slide')
	})

	it('should extract metadata from CRLF markdown', () => {
		const result = extractFrontmatter('---\r\ntitle: Hello\r\n---\r\n# Slide')

		expect(result.metadata).toEqual({ title: 'Hello' })
		expect(result.body).toBe('# Slide')
	})

	it('should return markdown as body when no frontmatter', () => {
		const markdown = '# Slide\n\ncontent'

		expect(extractFrontmatter(markdown)).toEqual({ body: markdown, metadata: {} })
	})

	it('should return markdown as body when frontmatter has no closing marks', () => {
		expect(extractFrontmatter('---\ntitle: Hello')).toEqual({
			body: '---\ntitle: Hello',
			metadata: {}
		})
	})
})