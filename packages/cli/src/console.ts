import { extname } from 'node:path'

const KB_COLUMN_WIDTH = 9

function detectColorSupport(): boolean {
	if (process.env.NO_COLOR) return false
	if (process.env.FORCE_COLOR) return process.env.FORCE_COLOR !== '0'
	return Boolean(process.stdout.isTTY)
}

const useColor = detectColorSupport()

/** Wrap text in an ANSI SGR code, or leave it untouched when color is unsupported */
export const paint = (code: number) => (s: string) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s)

export const bold = paint(1)
export const dim = paint(2)
export const red = paint(31)
export const green = paint(32)
export const yellow = paint(33)
export const blue = paint(34)
export const magenta = paint(35)
export const cyan = paint(36)
export const gray = paint(90)

/** Keep the text uncolored */
export const plain = (s: string) => s

/** Color by extension (js=cyan, css=magenta, html=green, map=gray) so output scans at a glance */
export function colorByExt(file: string): (s: string) => string {
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
export function sizeColor(bytes: number, warnKb: number): (s: string) => string {
	const sizeInKb = bytes / 1024
	if (sizeInKb >= warnKb) return red
	if (sizeInKb >= warnKb / 2) return yellow
	return plain
}

export function formatKb(bytes: number, width = KB_COLUMN_WIDTH): string {
	return (bytes / 1024).toFixed(2).padStart(width) + ' kB'
}
