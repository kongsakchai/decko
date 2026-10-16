import { VirtualModuleContent } from './types'

export const virtualMarkdown: VirtualModuleContent = (ctx) => {
	const readed = ctx.external.read(ctx.data.markdown)
	return readed ?? '<h1>404</h1>'
}
