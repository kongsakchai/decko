import { codes } from 'micromark-util-symbol'
import { Code, Construct, Extension } from 'micromark-util-types'
import markdown from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it, vi } from 'vitest'

import { addMicromarkExtensions } from '../../src/extensions/index'
import { nonLazyPartialTokenizer, partialBlankLineTokenizer } from '../../src/extensions/line'

function createMockParser(construct: Construct) {
	const result = vi.fn()
	const extension: Extension = {
		flow: {
			[codes.exclamationMark]: {
				name: 'mock',
				tokenize: function (effects, ok, nok) {
					return (code: Code) => {
						effects.enter('data')
						effects.consume(code)
						return effects.check(
							construct,
							function (code) {
								effects.exit('data')
								result('pass')
								return ok(code)
							},
							function (code) {
								effects.exit('data')
								result('fail')
								return nok(code)
							}
						)
					}
				}
			}
		}
	}
	const parser = unified()
		.use(markdown)
		.use(function (this) {
			addMicromarkExtensions(this, extension)
		})

	return { parser, result }
}

describe('line blank tokenizer', async () => {
	const { parser, result } = createMockParser(partialBlankLineTokenizer)

	it('should result is `fail` when no next line', () => {
		parser.parse('!decko')
		expect(result).toHaveBeenCalledWith('fail')
	})

	it('should result is `pass` when next line is blank', () => {
		parser.parse('!\n \ndecko')
		expect(result).toHaveBeenCalledWith('pass')
	})

	it('should result is `fail` when next line is not blank', () => {
		parser.parse('!\ndecko')
		expect(result).toHaveBeenCalledWith('pass')
	})
})

describe('non lazy line tokenizer', async () => {
	const { parser, result } = createMockParser(nonLazyPartialTokenizer)

	it('should result is `fail` when no next line', () => {
		parser.parse('!decko')
		expect(result).toHaveBeenCalledWith('fail')
	})

	it('should result is `fail` when next line is lazy line', () => {
		parser.parse('> !\ndecko')
		expect(result).toHaveBeenCalledWith('fail')
	})

	it('should result is `pass` when next line is not lazy line', () => {
		parser.parse('> !\n> decko')
		expect(result).toHaveBeenCalledWith('pass')
	})
})
