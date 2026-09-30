import { virtualExplorer } from './explorer'
import { virtualMarkdown, virtualSlide } from './slide'
import { virtualAppCSS } from './styles'

export * from './explorer'
export * from './slide'
export * from './styles'
export * from './types'

export const virtualModules = [virtualExplorer, virtualAppCSS, virtualSlide, virtualMarkdown]
