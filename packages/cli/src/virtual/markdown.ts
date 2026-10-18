import { VirtualContent } from './types'

export const virtualMarkdown: VirtualContent = (ctx) => {
	const markdown = ctx.markdown ?? ctx.data?.markdown ?? ''
	const readed = ctx.read(markdown)
	return readed ?? '<h1>404</h1>'
}
