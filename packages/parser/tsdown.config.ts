import { defineConfig } from 'tsdown'

import baseConfig from '../../tsdown.config.ts'

export default defineConfig({
	...baseConfig,
	entry: ['./src/index.ts'],
	deps: {
		neverBundle: [
			'@types/hast',
			'@types/mdast',
			'@types/unist',
			'micromark-util-character',
			'micromark-util-classify-character',
			'micromark-util-html-tag-name',
			'micromark-util-resolve-all',
			'micromark-util-symbol'
		]
	}
})
