import { virtualDirectory } from './directory'
import { virtualMarkdown, virtualSlide } from './slide'
import { virtualAppCSS } from './styles'

export * from './directory'
export * from './slide'
export * from './styles'
export * from './types'

export const virtualModules = [virtualDirectory, virtualAppCSS, virtualSlide,virtualMarkdown]
