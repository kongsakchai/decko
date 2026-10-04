import { virtualExplorer } from './explorer'
import { defineVirtualRoute } from './helper'
import { virtualEntryHTML } from './html'
import { virtualMarkdown } from './markdown'
import { SLIDE_PREFIX, SLIDE_SUFFIX, createSlideModuleId, virtualSlide } from './slide'
import { virtualStyle } from './styles'

export const virtualRoutes = [
	defineVirtualRoute({
		staticId: '/index.html',
		extract: (id) => 'decko:explorer.svelte',
		params: 'module',
		module: virtualEntryHTML
	}),
	defineVirtualRoute({
		staticId: 'decko:explorer.svelte',
		module: virtualExplorer
	}),
	defineVirtualRoute({
		staticId: 'decko:app.css',
		module: virtualStyle
	}),
	defineVirtualRoute({
		suffix: '.md/index.html',
		extract: (id) => createSlideModuleId(id.slice(0, -11)),
		params: 'module',
		module: virtualEntryHTML
	}),
	defineVirtualRoute({
		prefix: SLIDE_PREFIX,
		suffix: SLIDE_SUFFIX,
		params: 'markdown',
		module: virtualSlide
	}),
	defineVirtualRoute({
		suffix: '.md',
		params: 'markdown',
		extract: (id) => id,
		module: virtualMarkdown
	})
]
