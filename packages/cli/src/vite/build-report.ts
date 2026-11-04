import { extname } from 'node:path'
import { gzipSync } from 'node:zlib'
import type { Plugin } from 'vite'

export interface BuildReportOptions {
	warnKb?: number
}

type Row = {
	name: string
	size: number
	gzip: number
}

type ReportContext = {
	label?: string
	warnKb: number
	outDir: string
	elapsedMs: number
}

const DEFAULT_WARN_KB = 500
const KB_COLUMN_WIDTH = 9

function detectColorSupport(): boolean {
	if (process.env.NO_COLOR) return false
	if (process.env.FORCE_COLOR) return process.env.FORCE_COLOR !== '0'
	return Boolean(process.stdout.isTTY)
}

const useColor = detectColorSupport()

const paint = (code: number) => (s: string) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s)
const bold = paint(1)
const dim = paint(2)
const red = paint(31)
const green = paint(32)
const yellow = paint(33)
const blue = paint(34)
const magenta = paint(35)
const cyan = paint(36)
const gray = paint(90)

/** Used when a file is under the warn threshold: keep the text uncolored */
const plain = (s: string) => s

/** Color by extension (js=cyan, css=magenta, html=green, map=gray) so the report scans at a glance */
function colorByExt(file: string): (s: string) => string {
	switch (extname(file)) {
		case '.js':
		case '.mjs':
		case '.cjs':
			return cyan
		case '.css':
			return magenta
		case '.html':
			return green
		case '.map':
			return gray
		default:
			return blue // images, fonts, other assets
	}
}

/** At or above warnKb → red, at or above half of warnKb → yellow */
function sizeColor(bytes: number, warnKb: number): (s: string) => string {
	const sizeInKb = bytes / 1024
	if (sizeInKb >= warnKb) return red
	if (sizeInKb >= warnKb / 2) return yellow
	return plain
}

const sum = (values: number[]) => values.reduce((total, n) => total + n, 0)

function formatKb(bytes: number): string {
	return (bytes / 1024).toFixed(2).padStart(KB_COLUMN_WIDTH) + ' kB'
}

/** One row: folder (dim) + filename (by extension) + size + gzip */
function formatFileLine(row: Row, nameWidth: number, ctx: ReportContext): string {
	const slash = row.name.lastIndexOf('/') + 1
	const dir = dim(row.name.slice(0, slash))
	const file = colorByExt(row.name)(row.name.slice(slash))
	const gap = ' '.repeat(nameWidth - row.name.length)
	const size = sizeColor(row.size, ctx.warnKb)(formatKb(row.size))
	const gzip = dim('gzip:' + formatKb(row.gzip))
	return `  ${dir}${file}${gap}  ${size}  ${gzip}`
}

function formatTotalLine(rows: Row[], nameWidth: number): string {
	const size = formatKb(sum(rows.map((r) => r.size)))
	const gzip = formatKb(sum(rows.map((r) => r.gzip)))
	return `  ${bold('TOTAL'.padEnd(nameWidth))}  ${bold(size)}  ${dim('gzip:' + gzip)}`
}

function printReport(rows: Row[], ctx: ReportContext): void {
	const nameWidth = Math.max(...rows.map((r) => r.name.length))
	const title = ctx.label ? ` ${dim('[' + ctx.label + ']')}` : ''

	console.log(`\n${bold(green('✓'))} ${bold('Build report')}${title} ${dim('→ ' + ctx.outDir + '/')}`)
	for (const row of rows) {
		console.log(formatFileLine(row, nameWidth, ctx))
	}
	console.log(formatTotalLine(rows, nameWidth))
	console.log(`  ${dim('Built in ' + (ctx.elapsedMs / 1000).toFixed(2) + 's')}`)
}

export function buildReport({ warnKb = DEFAULT_WARN_KB }: BuildReportOptions = {}): Plugin {
	let outDir = 'dist'
	let start = 0
	let rows: Row[] = []

	return {
		name: 'build-report',
		apply: 'build',
		enforce: 'post',

		configResolved(config) {
			outDir = config.build.outDir
		},

		buildStart() {
			start = Date.now()
			rows = []
		},

		// Measure in writeBundle, not generateBundle: vite:singlefile rewrites the bundle
		// in a late generateBundle (inlining JS/CSS into the HTML, deleting the original
		// chunk files). writeBundle runs after every plugin has mutated the bundle, so the
		// reported sizes always match what actually landed on disk.
		writeBundle(_, bundle) {
			for (const file of Object.values(bundle)) {
				const content = file.type === 'chunk' ? file.code : file.source
				const buf = Buffer.from(content)
				rows.push({ name: file.fileName, size: buf.length, gzip: gzipSync(buf).length })
			}
		},

		// closeBundle also runs after a failed build; writeBundle never fired then, so rows is empty
		closeBundle() {
			if (!rows.length) return

			// Largest first, so the files worth attention sit on top
			rows.sort((a, b) => b.size - a.size)
			printReport(rows, { warnKb, outDir, elapsedMs: Date.now() - start })
		}
	}
}
