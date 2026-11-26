import { VirtualContent } from './types.js'

export const STYLE_ID = 'decko:app.css'

export const virtualStyle: VirtualContent = (ctx) => {
	return [
		`@import 'tailwindcss';`,
		`@import 'tw-animate-css';`,
		`@import '@deckomd/decko';`,
		`@source '${ctx.root}';`,
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
