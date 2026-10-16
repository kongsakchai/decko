import { VirtualModuleContent } from './types'

export const STYLE_ID = 'decko:app.css'

export const virtualStyle: VirtualModuleContent = (ctx) => {
	return [
		`@import 'tailwindcss';`,
		`@import 'tw-animate-css';`,
		`@import '@decko/decko/themes/decko.css';`,
		`@source './node_modules/@decko/decko/dist';`,
		`@source '${ctx.external.root}';`,
		`:root {`,
		`	font-synthesis: none;`,
		`	text-rendering: optimizeLegibility;`,
		`	-webkit-font-smoothing: antialiased;`,
		`	-moz-osx-font-smoothing: grayscale;`,
		`}`,
		`#app {`,
		`	display: contents;`,
		`}`,
		`body {`,
		`	line-height: 1.5;`,
		`	font-weight: 400;`,
		`	place-content: center;`,
		`	height: 100dvh;`,
		`	margin: 0;`,
		`	padding: 0;`,
		`	overflow: hidden;`,
		`}`
	].join('\n')
}
