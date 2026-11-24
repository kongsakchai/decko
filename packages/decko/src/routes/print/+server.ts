import { writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

export const GET = async () => {
	const browser = await chromium.launch()
	const page = await browser.newPage()

	await page.goto('http://localhost:5173/pdf', { waitUntil: 'load' })

	// 1) รอให้เนื้อหาบนหน้า "screen" วางเสร็จ (ตำแหน่งนี้ห้ามรีบ print)
	await page.evaluate(async () => {
		await document.fonts.ready
		await Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {})))
		await new Promise((r) => setTimeout(r, 200)) // Svelte transition (fade 100ms)
	})

	// 2) สลับเป็น print media ก่อนวัด
	//    -> ทำให้ค่าที่วัดได้ตรงกับ layout ที่จะเกิดขึ้นตอนพิมพ์จริง ๆ (scrollbar หาย, height:auto เป็นต้น)
	await page.emulateMedia({ media: 'print' })

	// 3) วัดขนาดจริงของแต่ละ slide
	const sizes = await page.evaluate(() =>
		Array.from(document.querySelectorAll<HTMLElement>('section.slide')).map((el) => {
			return {
				page: el.dataset.page as string,
				width: Math.round(el.clientWidth),
				height: Math.round(el.clientHeight)
			}
		})
	)

	// 4) สร้าง CSS ฝั่ง client
	const css = sizes
		.map(
			(s) => `
@page decko-${s.page} {
	size: ${s.width}px ${s.height}px;
	margin: 0;
}
section.slide[data-page="${s.page}"] {
	page: decko-${s.page};
	width: ${s.width}px;
	height: ${s.height}px;
}`
		)
		.join('\n')

	// 5) inject เข้า head (± write CSS ผ่าน page.addStyleTag ก็ได้ ไม่ต้อง touch DOM เอง)
	console.log(css)
	await page.addStyleTag({ content: css })

	// รอให้ Chromium เก็บ style แล้วจัด layout ใหม่
	await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))))

	// 6) print
	const pdf = await page.pdf({
		preferCSSPageSize: true, // <<< ต้องเปิด ไม่งั้น @page จะถูก ignore
		printBackground: true,
		margin: { top: '0', right: '0', bottom: '0', left: '0' }
	})

	await writeFile('deck.pdf', pdf)
	await browser.close()

	return new Response('ok')
}
