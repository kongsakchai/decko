import { Command } from 'commander'
import * as readline from 'node:readline'

import { build } from './command/build'
import { createServer } from './command/serv'

const program = new Command('🚀 Decko')

function setupKeyboardShortcuts(server: Awaited<ReturnType<typeof createServer>>) {
	// Keyboard shortcuts are only available in an interactive terminal.
	if (!process.stdin.isTTY) return

	process.stdin.resume() // default mode is pause. must set to resume for binding
	process.stdin.setEncoding('utf8')

	readline.emitKeypressEvents(process.stdin) // consume event
	process.stdin.setRawMode(true) // process event when key is pressed without enter.

	process.stdin.on('keypress', async (_input, key) => {
		if (key.ctrl && key.name === 'c') {
			process.exit(0)
		}

		switch (key.name) {
			case 'r':
				await server.restart()
				console.log('Server restarted.')
				break

			case 'q':
				console.log('Shutting down...')

				try {
					await server.close()
				} finally {
					process.exit(0)
				}
		}
	})
}

program
	.command('build')
	.description('Build Markdown slide decks into static HTML.')
	.argument('<src>', 'Path to a slide file or slide directory.')
	.option('-i, --isolated', 'Build each slide independently without sharing JavaScript bundles.')
	.option('-o, --output <dir>', 'Output directory for the generated files.', 'dist')
	.option('--no-index', 'Exclude the index slide from the build.')
	.action(async (src, options) => {
		await build(src, options)
	})
	.showHelpAfterError()

program
	.command('dev')
	.alias('serve')
	.description('Start the development server for Markdown slide decks.')
	.argument('<src>', 'Path to a slide file or slide directory.')
	.option('-p, --port <port>', 'Port for the development server.', '5173')
	.action(async (src, options) => {
		const server = await createServer(src, options)
		setupKeyboardShortcuts(server)
	})

program
	.name('decko')
	.description('Generate presentation slide decks from Markdown using Svelte.')
	.version('1.0.0')
	.action(() => {
		program.help()
	})

program.parse(process.argv)
