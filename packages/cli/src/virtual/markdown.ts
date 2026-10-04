import { VirtualModule } from './types'

export const virtualMarkdown: VirtualModule = {
	content(ctx) {
		const readed = ctx.external.read(ctx.data.markdown)
		return readed ?? '<h1>404</h1>'
	}
}
