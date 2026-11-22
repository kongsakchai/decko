import { buildReport } from '@/vite/build-report'

import { afterEach, describe, expect, it, vi } from 'vitest'

type TestPlugin = {
	configResolved: (config: { build: { outDir: string } }) => void
	buildStart: () => void
	writeBundle: (options: unknown, bundle: Record<string, unknown>) => void
	closeBundle: () => void
}

const ESC = String.fromCharCode(27)
const ANSI = new RegExp(`${ESC}\\[[0-9;]*m`, 'g')

function stripAnsi(value: string): string {
	return value.replace(ANSI, '')
}

function setup(outDir = 'dist') {
	const log = vi.spyOn(console, 'log').mockImplementation(() => {})
	const plugin = buildReport({ warnKb: 1 }) as unknown as TestPlugin

	plugin.configResolved({ build: { outDir } })
	plugin.buildStart()

	return { plugin, log }
}

function outputOf(log: ReturnType<typeof vi.spyOn>): string {
	return log.mock.calls.map(([line]) => stripAnsi(String(line))).join('\n')
}

afterEach(() => {
	vi.restoreAllMocks()
	vi.useRealTimers()
})

describe('buildReport', () => {
	it('prints a report sorted from largest to smallest file', () => {
		const { plugin, log } = setup()

		plugin.writeBundle(
			{},
			{
				'assets/small.js': { type: 'chunk', fileName: 'assets/small.js', code: 'x' },
				'assets/big.js': { type: 'chunk', fileName: 'assets/big.js', code: 'x'.repeat(2048) },
				'assets/app.css': { type: 'asset', fileName: 'assets/app.css', source: 'y'.repeat(1024) }
			}
		)
		plugin.closeBundle()

		const output = outputOf(log)
		const lines = output.split('\n')

		expect(output).toContain('Build report')
		expect(output).toContain('dist/')
		expect(output).toContain('TOTAL')
		expect(output).toContain('gzip:')

		const big = lines.findIndex((line) => line.includes('big.js'))
		const css = lines.findIndex((line) => line.includes('app.css'))
		const small = lines.findIndex((line) => line.includes('small.js'))

		expect(big).toBeLessThan(css)
		expect(css).toBeLessThan(small)
	})

	it('reports the configured output directory', () => {
		const { plugin, log } = setup('build')

		plugin.writeBundle({}, { 'index.html': { type: 'asset', fileName: 'index.html', source: '<html></html>' } })
		plugin.closeBundle()

		expect(outputOf(log)).toContain('build/')
	})

	it('reports the elapsed build time', () => {
		vi.useFakeTimers()
		vi.setSystemTime(0)

		const { plugin, log } = setup()

		vi.setSystemTime(1500)
		plugin.writeBundle({}, { 'app.js': { type: 'chunk', fileName: 'app.js', code: 'x' } })
		plugin.closeBundle()

		expect(outputOf(log)).toContain('Built in 1.50s')
	})

	it('does not print when the build wrote no files', () => {
		const { plugin, log } = setup()

		plugin.closeBundle()

		expect(log).not.toHaveBeenCalled()
	})
})
