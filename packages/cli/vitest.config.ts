import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(import.meta.dirname, './src')
		}
	},
	test: {
		name: '@deckomd/cli',
		environment: 'node',
		include: ['test/**/*.test.ts'],
		coverage: {
			provider: 'v8',
			include: ['src/**/*.ts'],
			thresholds: {
				perFile: true,
				lines: 80,
				functions: 80,
				branches: 80,
				statements: 80
			},
			reporter: ['text', 'text-summary', 'html']
		}
	}
})
