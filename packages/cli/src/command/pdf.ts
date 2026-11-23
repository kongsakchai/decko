import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

import { createServer } from './serv'

export async function pdf(root: string) {
	const server = await createServer(root)
	const port = server.config.server.port

	const browser = await chromium.launch() // headless
	const page = await browser.newPage()

	await page.goto(`http://localhost:${port}`, { waitUntil: 'load' })

	// รอ font + image + async content ให้เสร็จก่อน
	await page.evaluate(async () => {
		await document.fonts.ready
		await Promise.all(
			Array.from(document.images).map((img) =>
				img.complete ? img.decode().catch(() => {}) : new Promise((r) => (img.onload = img.onerror = r))
			)
		)
		// รอ transition ของ Svelte (fade 100ms) ให้จบ
		await new Promise((r) => setTimeout(r, 200))
	})

	const pdf = await page.pdf({
		preferCSSPageSize: true, // <<< จำเป็นมาก
		printBackground: true,
		margin: { top: '0', right: '0', bottom: '0', left: '0' }
	})

	await writeFile('deck.pdf', pdf)
	await browser.close()
}
