import type { Directive } from '@deckomd/parser'

import { describe, expect, it } from 'vitest'

import { getCSSImports, getThemeImports } from './themes.js'

const themePath = (name: string) => `import '@deckomd/decko/themes/${name}.css'`

describe('getThemeImports', () => {
	it('should import all built-in themes by default', () => {
		const directive: Directive = {}

		const imports = getThemeImports(directive)

		expect(directive.themes).toEqual([
			'default',
			'claude',
			'catppuccin',
			'dracula',
			'bubblegum',
			'cyberpunk',
			'forest',
			'ocean'
		])
		expect(directive).not.toHaveProperty('customThemes')
		expect(imports).toEqual([
			themePath('claude'),
			themePath('catppuccin'),
			themePath('dracula'),
			themePath('bubblegum'),
			themePath('cyberpunk'),
			themePath('forest'),
			themePath('ocean')
		])
	})

	it('should only import the requested themes', () => {
		const directive: Directive = { themes: 'default,dracula' }

		expect(getThemeImports(directive)).toEqual([themePath('dracula')])
		expect(directive.themes).toEqual(['default', 'dracula'])
	})

	it('should import custom themes', () => {
		const directive: Directive = {
			themes: 'default,blue,dracula',
			customThemes: { blue: 'blue.css', dracula: 'custom-dracula.css', invalid: 10 }
		}

		expect(getThemeImports(directive)).toEqual(["import 'blue.css'", "import 'custom-dracula.css'"])
		expect(directive).not.toHaveProperty('customThemes')
	})

	it('should include custom themes when themes are not specified', () => {
		const directive: Directive = { customThemes: { blue: 'blue.css' } }

		const imports = getThemeImports(directive)

		expect(imports).toContain("import 'blue.css'")
		expect(imports).toContain(themePath('ocean'))
	})

	it('should ignore invalid custom themes', () => {
		const directive: Directive = { customThemes: { blue: 10 } }

		expect(getThemeImports(directive)).not.toContain("import 'blue.css'")
	})

	it('should throw for unknown themes', () => {
		const directive: Directive = { themes: 'unknown' }

		expect(() => getThemeImports(directive)).toThrow(
			'Unknown theme "unknown": not a built-in theme and not listed in customThemes'
		)
	})
})

describe('getCSSImports', () => {
	it('should return empty array when css is missing', () => {
		expect(getCSSImports({ title: 'Test', pages: [] })).toEqual([])
	})

	it('should import css files', () => {
		expect(getCSSImports({ title: 'Test', pages: [], css: 'a.css, b.css' })).toEqual([
			"import 'a.css'",
			"import 'b.css'"
		])
	})

	it('should deduplicate css imports', () => {
		expect(getCSSImports({ title: 'Test', pages: [], css: ['a.css', 'a.css'] })).toEqual(["import 'a.css'"])
	})
})
