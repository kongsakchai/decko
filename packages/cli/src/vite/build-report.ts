import { bold, colorByExt, dim, formatKb, green, sizeColor } from '@/console'

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

const sum = (values: number[]) => values.reduce((total, n) => total + n, 0)

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
