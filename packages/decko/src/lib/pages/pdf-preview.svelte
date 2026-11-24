<script lang="ts">
	import { PDFContainer, PDFControl } from '../components/index.js'
	import { getThemes } from '../logic/themes.js'
	import { asString } from '../logic/utils.js'
	import { appearance } from '../state/appearance.svelte.js'
	import type { SlideComponent, SlideData } from '../types.js'

	interface Props {
		data: SlideData
		slide: SlideComponent
		width?: number
		height?: number
	}

	const { data, slide: Slide, width = 1280, height = 720 }: Props = $props()

	// svelte-ignore state_referenced_locally
	appearance.setupThemes(asString(data.theme, ''), getThemes(data.themes) ?? [])
</script>

<svelte:head>
	<title>🌱 PDF {data.title}</title>
</svelte:head>

<main class="h-full w-full">
	<PDFContainer {width} {height}>
		{#snippet slide()}
			<Slide page={0} step={0} showAll />
		{/snippet}
	</PDFContainer>

	<PDFControl />
</main>

<style>
	:global {
		@media print {
			html,
			body {
				margin: 0 !important;
				padding: 0 !important;
				height: auto !important;
				overflow: visible !important;
				background: #fff !important;
			}

			section.slide {
				position: relative;
				overflow: hidden; /* บังคับ 1 slide = 1 หน้า ไม่ให้เนื้อหาวิ่งไปหน้าใหม่ */
				break-after: page;
			}
			section.slide:last-child {
				break-after: auto; /* ป้องกันหน้าว่างท้ายไฟล์ */
			}

			/* ซ่อน UI ที่ไม่อยากให้ติด PDF */
			.control {
				display: none !important;
			}

			* {
				transition: none !important;
				animation: none !important;
			}
		}
	}
</style>
