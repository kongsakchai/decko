import { codes } from 'micromark-util-symbol'
import { Code } from 'micromark-util-types'
import { describe, expect, it } from 'vitest'

import { SCOPE_ACTION, createScopeResolver } from '../../src/extensions/scope'

const scope = createScopeResolver([codes.leftCurlyBrace])

describe('scope resolver', () => {
	const testcase: [Code, SCOPE_ACTION][] = [
		[codes.rightCurlyBrace, 'MISMATCH'],
		[codes.leftCurlyBrace, 'PUSH'],
		[codes.leftCurlyBrace, 'PUSH'],
		[codes.rightCurlyBrace, 'POP'],
		[codes.quotationMark, 'PUSH'],
		[codes.backslash, null],
		[codes.quotationMark, null],
		[codes.quotationMark, 'POP'],
		[codes.graveAccent, 'PUSH'],
		[codes.dollarSign, null],
		[codes.leftCurlyBrace, 'PUSH'],
		[codes.lowercaseA, null],
		[codes.rightCurlyBrace, 'POP'],
		[codes.eof, null]
	]

	for (const [code, result] of testcase) {
		it(`should return ${result} when ${String.fromCharCode(code!)}`, () => {
			const r = scope.resolve(code)
			expect(r).toBe(result)
		})
	}

	it('should return 0 dept when reset scope', () => {
		expect(scope.depth).toBe(2)
		scope.reset()
		expect(scope.depth).toBe(0)
	})
})
