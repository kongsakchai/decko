import { codes } from 'micromark-util-symbol'
import type { Code } from 'micromark-util-types'

export type SCOPE_ACTION = 'POP' | 'PUSH' | 'MISMATCH' | null

const CLOSER_OF = new Map<Code, Code>([
	[codes.leftCurlyBrace, codes.rightCurlyBrace],
	[codes.leftParenthesis, codes.rightParenthesis],
	[codes.leftSquareBracket, codes.rightSquareBracket]
])

const CLOSERS = new Set<Code>(CLOSER_OF.values())
const QUOTES = new Set<Code>([codes.quotationMark, codes.apostrophe, codes.graveAccent])

const isOpener = (code: Code) => CLOSER_OF.has(code) || QUOTES.has(code)

// `parent` restricts which openers may start a scope when the stack is empty.
// If omitted, any opener is allowed. Once the stack is non-empty, it is ignored.
export function createScopeResolver(parent?: readonly Code[]) {
	const stack: Code[] = []
	let escaped = false // previous char was a backslash inside a quote
	let dollar = false // previous char was `$` inside a backtick (waiting for `{`)

	const canOpen = (code: Code) => isOpener(code) && (stack.length > 0 || !parent || parent.includes(code))

	const resolve = (code: Code): SCOPE_ACTION => {
		if (code === codes.eof) return null

		const top = stack.at(-1)

		// Inside a quote (top is a quote char)
		if (top != undefined && QUOTES.has(top)) {
			if (escaped) {
				escaped = false
				dollar = false
				return null
			}

			if (code === codes.backslash) {
				escaped = true
				dollar = false
				return null
			}

			if (code === top) {
				stack.pop()
				dollar = false
				return 'POP'
			}

			// Template literal: `${` opens an expression scope
			if (top === codes.graveAccent) {
				if (dollar && code === codes.leftCurlyBrace) {
					dollar = false
					stack.push(code)
					return 'PUSH'
				}
				dollar = code === codes.dollarSign
			}

			return null
		}

		// Opener
		if (isOpener(code)) {
			if (!canOpen(code)) return null // not allowed to start with this opener
			stack.push(code)
			escaped = false
			dollar = false
			return 'PUSH'
		}

		// Closing bracket
		if (CLOSERS.has(code)) {
			if (top != undefined && CLOSER_OF.get(top) === code) {
				stack.pop()
				return 'POP'
			}
			return 'MISMATCH' // wrong closer type, or stack is empty
		}

		return null
	}

	const reset = () => {
		stack.length = 0
		escaped = false
		dollar = false
	}

	return {
		resolve,
		reset,
		canOpen,
		get depth() {
			return stack.length
		}
	}
}
