import { EXPLORER_ID } from './explorer.js'
import { createPDFModuleId } from './pdf.js'
import { createSlideModuleId } from './slide.js'
import { VirtualContent } from './types.js'

export const HTML_SUFFIX = '/index.html'

export const virtualEntryHTML: VirtualContent = (ctx) => {
	let module = ctx.single ?? ctx.data?.module
	if (module?.endsWith('/pdf')) {
		module = createPDFModuleId(module.replace(/\/pdf$/, ''))
	} else if (module?.endsWith('.md')) {
		module = createSlideModuleId(module)
	} else {
		module = EXPLORER_ID
	}

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
		`import App from '${module}'`,
		`const appElement = document.getElementById('app')`,
		`if (appElement) mount(App, { target: appElement })`,
		`</script>`,
		`</body>`,
		`</html>`
	].join('\n')
}
