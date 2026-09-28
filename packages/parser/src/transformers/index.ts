import type { Root as MRoot } from 'mdast'
import type { Processor } from 'unified'

import { Alert, CodeContainer, CodeHighlighter, Extension, PostExtension } from '../types.js'
import { alertTransformer } from './alert.js'
import { codeblockTransformer } from './codeblock.js'
import { containerTransformer } from './container.js'
import { directiveTransformer, parseYAML } from './directive.js'
import { extensionsTransform } from './extensions.js'
import { imageTransformer } from './image.js'
import { PAGE_BREAK_KEY, pageBreakTransformer } from './page-break.js'
import { extractScriptTransformer } from './script.js'

export { PAGE_BREAK_KEY, parseYAML }

export interface TransformOptions {
	codeHighlighter?: CodeHighlighter
	codeContainer?: CodeContainer
	customContainer?: string[]
	extensions?: Extension[]
	postExtension?: PostExtension[]
	customAlerts?: Record<string, Alert>
}

export function applyTransformers(
	process: Processor<MRoot, MRoot, undefined, undefined, undefined>,
	options?: TransformOptions
) {
	process.use(pageBreakTransformer)
	process.use(codeblockTransformer, { highlighter: options?.codeHighlighter, container: options?.codeContainer })
	process.use(extractScriptTransformer)
	process.use(directiveTransformer)
	process.use(imageTransformer)
	process.use(alertTransformer, { customAlerts: options?.customAlerts })
	process.use(containerTransformer, { customContainer: options?.customContainer })
	process.use(extensionsTransform, { extensions: options?.extensions, postExtensions: options?.postExtension }) // should to be last
}
