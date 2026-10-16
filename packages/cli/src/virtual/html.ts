import { EXPLORER_ID } from './explorer'
import { createSlideModuleId } from './slide'
import { VirtualModuleContent } from './types'

export const HTML_SUFFIX = '/index.html'

export const virtualEntryHTML: VirtualModuleContent = (ctx) => {
	let module = ctx.data.module ?? ''
	if (ctx.external.isSingle && ctx.external.markdowns().length === 1) {
		module = createSlideModuleId(ctx.external.markdown(0)!)
	} else if (ctx.data.module.endsWith('.md')) {
		module = createSlideModuleId(ctx.data.module)
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
