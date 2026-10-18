import { EXPLORER_ID } from './explorer'
import { createSlideModuleId } from './slide'
import { VirtualContent } from './types'

export const HTML_SUFFIX = '/index.html'

export const virtualEntryHTML: VirtualContent = (ctx) => {
	let module = ctx.markdown ?? ctx.data?.module
	if (module?.endsWith('.md')) {
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
