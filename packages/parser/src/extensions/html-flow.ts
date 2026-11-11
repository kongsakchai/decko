import { asciiAlpha, asciiAlphanumeric, markdownLineEnding, markdownLineEndingOrSpace } from 'micromark-util-character'
import { htmlBlockNames, htmlRawNames } from 'micromark-util-html-tag-name'
import { codes, types } from 'micromark-util-symbol'
import type { Code, Construct, Effects, Extension, State, TokenizeContext } from 'micromark-util-types'

import { nonLazyPartialTokenizer, partialBlankLineTokenizer } from './line.js'

// Tag Type
// Type 1: <script> <pre> <style>
// Type 2: Comment
// Type 3: Processing instructions <?...?>
// Type 4: Declarations <!...>
// Type 5: CDATA <![CDATA[...]]>
// Type 6: basic
// Type 7: complete tags <.../>, </...>, component

const RAW_TAGS = new Set(htmlRawNames)
const BASIC_TAGS = new Set(htmlBlockNames)

// Tokenize

const htmlFlowTokenizer: Construct = {
	concrete: true,
	name: 'html-flow',
	tokenize(this: TokenizeContext, effects: Effects, ok: State, nok: State): State {
		let tagNameBuffer: number[] = []
		const isInterrupt = this.interrupt
		const isLazy = () => this.parser.lazy[this.now().line]

		function start(code: Code): State | undefined {
			effects.enter(types.htmlFlow)
			effects.enter(types.htmlFlowData)
			effects.consume(code) // consume `<`
			return open
		}

		// Open - check after `<`
		function open(code: Code): State | undefined {
			if (code === codes.slash) {
				effects.consume(code) // consume `\`
				return openTagName
			}

			return openTagName(code)
		}

		// tag name
		function openTagName(code: Code) {
			if (code == null || !asciiAlpha(code)) return nok(code)
			tagNameBuffer = [code]
			effects.consume(code) // consume character
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
				return closeTagName(code)
			}

			// Continue tag name
			if (code != null && (code === codes.dash || asciiAlphanumeric(code))) {
				tagNameBuffer.push(code)
				effects.consume(code)
				return tagName
			}

			return nok(code)
		}

		function closeTagName(code: Code) {
			const name = String.fromCodePoint(...tagNameBuffer).toLowerCase()
			if (RAW_TAGS.has(name) || BASIC_TAGS.has(name)) return nok(code)

			// Do not support complete HTML when interrupting (CommonMark 4.6 "HTML blocks"):
			// types 1–6 may interrupt a paragraph, but type 7 (a complete tag like
			// `<span>`, `<Component />`) may not.
			// e.g. `hello, markdown\n<span>text</span>` stays inside the paragraph:
			//   <p>hello, markdown\n<span>text</span></p>
			// Exception per 5.1/5.2 "Laziness": laziness only applies to paragraph
			// continuation text, so on a lazy line (no `>` / list marker) the complete
			// tag can interrupt and becomes its own HTML block:
			// e.g. `> hello, markdown\n<span>text</span>`:
			//   <blockquote>\n<p>hello, markdown</p>\n</blockquote>\n<span>text</span>
			if (isInterrupt && !isLazy()) return nok(code)

			return more(code)
		}

		// --- more
		function more(code: Code): State | undefined {
			if (isInterrupt) return ok(code)
			if (code === codes.eof) {
				effects.exit(types.htmlFlowData)
				return done(code)
			}

			if (markdownLineEnding(code)) {
				effects.exit(types.htmlFlowData)
				return checkBlankLine(code)
			}

			effects.consume(code)
			return more
		}

		// done
		function done(code: Code) {
			effects.exit(types.htmlFlow)
			return ok(code)
		}

		// --- Multiple-line

		// check blank line for normal tag
		// blank line: done
		// non blank line: check non lazy
		function checkBlankLine(code: Code) {
			return effects.check(partialBlankLineTokenizer, done, checkNonLazy)(code)
		}

		// check non lazy line
		// non lazy: continua
		// lazy: done
		function checkNonLazy(code: Code) {
			return effects.attempt(nonLazyPartialTokenizer, checkNextLine, done)(code)
		}

		function checkNextLine(code: Code) {
			effects.enter(types.htmlFlowData)
			return more(code)
		}

		return start
	}
}

export const htmlFlow: Extension = {
	flow: {
		[codes.lessThan]: htmlFlowTokenizer
	}
}
