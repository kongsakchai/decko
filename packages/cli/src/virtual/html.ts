import { VirtualModule } from './types'

export const virtualEntryHTML: VirtualModule = {
	content(ctx) {
		return [
			`<!doctype html>`,
			`<html lang="en">`,
			`<head>`,
			`<meta charset="UTF-8" />`,
			`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
			`<title>Decko</title>`,
			`</head>`,
			`<body>`,
			`<div id="app"></div>`,
			`<script type="module">`,
			`import { mount } from 'svelte'`,
			`import 'decko:app.css'`,
			`import App from '${ctx.data.module}'`,
			`const appElement = document.getElementById('app')`,
			`if (appElement) mount(App, { target: appElement })`,
			`</script>`,
			`</body>`,
			`</html>`
		].join('\n')
	}
}
