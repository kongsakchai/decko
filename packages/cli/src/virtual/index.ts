import { EXPLORER_ID, virtualExplorer } from './explorer'
import { virtualEntryHTML } from './html'
import { virtualMarkdown } from './markdown'
import { SLIDE_PREFIX, SLIDE_SUFFIX, virtualSlide } from './slide'
import { STYLE_ID, virtualStyle } from './styles'
import { defineVirtualModule } from './virtual'

export const virtualRoutes = [
	defineVirtualModule({
		suffix: /[\\/]?index\.html$/,
		params: 'module',
		content: virtualEntryHTML
	}),
	defineVirtualModule({
		staticId: EXPLORER_ID,
		content: virtualExplorer
	}),
	defineVirtualModule({
		staticId: STYLE_ID,
		content: virtualStyle
	}),
	defineVirtualModule({
		prefix: SLIDE_PREFIX,
		suffix: SLIDE_SUFFIX,
		params: 'markdown',
		content: virtualSlide
	}),
	defineVirtualModule({
		suffix: '.md',
		params: 'markdown',
		content: virtualMarkdown,
		extract: (id) => ({ markdown: id })
	})
]
