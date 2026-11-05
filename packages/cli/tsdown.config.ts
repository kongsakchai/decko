import { readFileSync } from 'node:fs'
import { defineConfig } from 'tsdown'

import baseConfig from '../../tsdown.config.ts'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))

export default defineConfig({
	...baseConfig,
	entry: ['./src/index.ts'],
	banner: '#!/usr/bin/env node',
	define: {
		__DECKO_VERSION__: JSON.stringify(pkg.version)
	}
})
