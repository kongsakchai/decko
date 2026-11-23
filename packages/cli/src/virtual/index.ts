import { EXPLORER_ID, virtualExplorer } from './explorer'
import { virtualEntryHTML } from './html'
import { virtualMarkdown } from './markdown'
import { PDF_PREFIX, PDF_SUFFIX, virtualPDF } from './pdf'
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
		prefix: PDF_PREFIX,
		suffix: PDF_SUFFIX,
		params: 'markdown',
		content: virtualPDF
	}),
	defineVirtualModule({
		suffix: '.md',
		params: 'markdown',
		content: virtualMarkdown,
		extract: (id) => ({ markdown: id })
	})
]
