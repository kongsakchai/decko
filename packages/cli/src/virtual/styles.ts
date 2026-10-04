import { VirtualModule } from './types'

export const virtualStyle: VirtualModule = {
	content(ctx) {
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
}
