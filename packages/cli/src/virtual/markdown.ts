import { VirtualContent } from './types.js'

export const virtualMarkdown: VirtualContent = (ctx) => {
	const markdown = ctx.single ?? ctx.data?.markdown ?? ''
	const readed = ctx.read(markdown)
	return readed ?? '<h1>404</h1>'
}
