import { afterEach, describe, expect, it, vi } from 'vitest'

type ConsoleModule = typeof import('@/console')

/**
 * `console.ts` reads the color settings once, at module load, so each test needs a
 * fresh module instance with the environment it wants to exercise.
 */
async function loadConsole(env: { NO_COLOR?: string; FORCE_COLOR?: string } = {}): Promise<ConsoleModule> {
	vi.resetModules()
	vi.stubEnv('NO_COLOR', env.NO_COLOR ?? '')
	vi.stubEnv('FORCE_COLOR', env.FORCE_COLOR ?? '')
	return import('@/console')
}

afterEach(() => {
	vi.unstubAllEnvs()
	vi.resetModules()
})

describe('colors', () => {
	it('paints text with ANSI codes when color is enabled', async () => {
		const { bold, paint } = await loadConsole({ FORCE_COLOR: '1' })

		expect(bold('build')).toBe('\x1b[1mbuild\x1b[0m')
		expect(paint(42)('custom')).toBe('\x1b[42mcustom\x1b[0m')
	})

	it('maps each color helper to its SGR code', async () => {
		const c = await loadConsole({ FORCE_COLOR: '1' })
		const expected = [
			[c.bold, 1],
			[c.dim, 2],
			[c.red, 31],
			[c.green, 32],
			[c.yellow, 33],
			[c.blue, 34],
			[c.magenta, 35],
			[c.cyan, 36],
			[c.gray, 90]
		] as const

		for (const [color, code] of expected) {
			expect(color('x')).toBe(`\x1b[${code}mx\x1b[0m`)
		}
	})

	it('keeps text plain when NO_COLOR is set', async () => {
		const { bold, plain } = await loadConsole({ NO_COLOR: '1' })

		expect(bold('build')).toBe('build')
		expect(plain('build')).toBe('build')
	})

	it('prefers NO_COLOR over FORCE_COLOR', async () => {
		const { bold } = await loadConsole({ NO_COLOR: '1', FORCE_COLOR: '1' })

		expect(bold('build')).toBe('build')
	})

	it('keeps text plain when FORCE_COLOR is 0', async () => {
		const { bold } = await loadConsole({ FORCE_COLOR: '0' })

		expect(bold('build')).toBe('build')
	})

	it('falls back to stdout TTY detection when no override is set', async () => {
		const { bold } = await loadConsole()

		expect(bold('build')).toBe(process.stdout.isTTY ? '\x1b[1mbuild\x1b[0m' : 'build')
	})
})

describe('colorByExt', () => {
	it('picks a color for each known extension', async () => {
		const c = await loadConsole({ FORCE_COLOR: '1' })

		expect(c.colorByExt('app.js')).toBe(c.cyan)
		expect(c.colorByExt('app.mjs')).toBe(c.cyan)
		expect(c.colorByExt('app.cjs')).toBe(c.cyan)
		expect(c.colorByExt('app.css')).toBe(c.magenta)
		expect(c.colorByExt('index.html')).toBe(c.green)
		expect(c.colorByExt('app.js.map')).toBe(c.gray)
	})

	it('falls back to blue for other assets', async () => {
		const c = await loadConsole({ FORCE_COLOR: '1' })

		expect(c.colorByExt('logo.png')).toBe(c.blue)
		expect(c.colorByExt('font.woff2')).toBe(c.blue)
		expect(c.colorByExt('README')).toBe(c.blue)
	})
})

describe('sizeColor', () => {
	it('marks sizes at or above the threshold red', async () => {
		const c = await loadConsole({ FORCE_COLOR: '1' })

		expect(c.sizeColor(500 * 1024, 500)).toBe(c.red)
		expect(c.sizeColor(1024 * 1024, 500)).toBe(c.red)
	})

	it('marks sizes at or above half the threshold yellow', async () => {
		const c = await loadConsole({ FORCE_COLOR: '1' })

		expect(c.sizeColor(250 * 1024, 500)).toBe(c.yellow)
		expect(c.sizeColor(499 * 1024, 500)).toBe(c.yellow)
	})

	it('leaves smaller sizes plain', async () => {
		const c = await loadConsole({ FORCE_COLOR: '1' })

		expect(c.sizeColor(249 * 1024, 500)).toBe(c.plain)
		expect(c.sizeColor(0, 500)).toBe(c.plain)
	})
})

describe('formatKb', () => {
	it('formats bytes as right-aligned kB', async () => {
		const { formatKb } = await loadConsole({ FORCE_COLOR: '1' })

		expect(formatKb(0)).toBe('     0.00 kB')
		expect(formatKb(1024)).toBe('     1.00 kB')
		expect(formatKb(1536)).toBe('     1.50 kB')
	})

	it('supports a custom column width', async () => {
		const { formatKb } = await loadConsole({ FORCE_COLOR: '1' })

		expect(formatKb(1024, 0)).toBe('1.00 kB')
		expect(formatKb(1024, 12)).toBe(`${' '.repeat(8)}1.00 kB`)
	})
})
