import { asciiAlpha, asciiAlphanumeric, markdownLineEnding, markdownLineEndingOrSpace } from 'micromark-util-character'
import { codes, types } from 'micromark-util-symbol'
import type { Code, Construct, Effects, Extension, State, TokenizeContext } from 'micromark-util-types'

import { partialBlankLineTokenizer } from './line.js'
import { createScopeResolver } from './scope.js'

// --- Tokenize

const htmlTextTokenizer: Construct = {
	name: 'html-text',
	tokenize(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
		const a = this
		const scope = createScopeResolver()
		return start

		function start(code: Code): State | undefined {
			effects.enter(types.htmlText)
			effects.enter(types.htmlTextData)
			effects.consume(code) // consume `<`
			return open
		}

		// Open - check after `<`
		function open(code: Code): State | undefined {
			if (code == null || !asciiAlpha(code)) return nok(code)
			effects.consume(code) // consume character)
			return tagName
		}

		// validate tag name
		function tagName(code: Code) {
			// tag end with `>`, `\`, null, space
			if (
				code === codes.greaterThan ||
				code === codes.slash ||
				code === codes.eof ||
				markdownLineEndingOrSpace(code)
			) {
				return more(code)
			}

			// Continue tag name
			if (code != null && (code === codes.dash || asciiAlphanumeric(code))) {
				effects.consume(code)
				return tagName
			}

			return nok(code)
		}

		// check end with `>`
		function completeEnd(code: Code) {
			if (code === codes.greaterThan) {
				effects.consume(code)
				effects.exit(types.htmlTextData)
				return done
			}

			return nok(code)
		}

		// --- more
		function more(code: Code): State | undefined {
			if (code === codes.eof) return nok(code)

			if (scope.depth === 0 && code === codes.slash) {
				effects.consume(code)
				return completeEnd
			}
			if (scope.depth === 0 && code === codes.greaterThan) {
				effects.consume(code)
				effects.exit(types.htmlTextData)
				return done
			}

			if (markdownLineEnding(code)) {
				effects.exit(types.htmlTextData)
				return effects.check(partialBlankLineTokenizer, done, startNextLine)(code)
			}

			scope.resolve(code)
			effects.consume(code)

			return more
		}

		function startNextLine(code: Code) {
			effects.enter(types.lineEnding)
			effects.consume(code)
			effects.exit(types.lineEnding)
			effects.enter(types.htmlTextData)
			return more
		}

		// done
		function done(code: Code) {
			effects.exit(types.htmlText)
			return ok(code)
		}
	}
}

export const htmlText: Extension = {
	text: {
		[codes.lessThan]: htmlTextTokenizer
	}
}
