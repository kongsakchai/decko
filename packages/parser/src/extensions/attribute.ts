import type { CompileContext, Extension as FromMarkdownExtension } from 'mdast-util-from-markdown'
import { markdownLineEnding, markdownLineEndingOrSpace } from 'micromark-util-character'
import { codes, types } from 'micromark-util-symbol'
import type { Code, Effects, State, Token } from 'micromark-util-types'

import { createScopeResolver } from './scope.js'
import { partialSpaceTokenizer } from './space.js'

// Tokenize

export function createAttributeTokenize(
	effects: Effects,
	ok: State,
	nok: State,
	closeCode: Code,
	multipleLine: boolean = false
) {
	const scope = createScopeResolver([codes.leftCurlyBrace, codes.quotationMark, codes.apostrophe, codes.graveAccent])
	let closeScopedValue = closeValue

	const isEnd = (code: Code) => code === codes.eof || markdownLineEnding(code) || code === closeCode
	const isEndOrSpace = (code: Code) => code === codes.eof || markdownLineEndingOrSpace(code) || code === closeCode

	// Entry

	function start(code: Code) {
		if (isEnd(code)) return beforeEnd(code, nok)
		effects.enter('attribute')
		return effects.attempt(partialSpaceTokenizer, openSequence, openSequence)(code)
	}

	function openSequence(code: Code) {
		if (isEnd(code)) return beforeEnd(code)
		effects.enter('attributeSequence')
		closeScopedValue = closeValue

		if (code === codes.dot) {
			effects.enter('attributeClass')
			effects.consume(code)
			return classAttribute
		}
		if (code === codes.numberSign) {
			effects.enter('attributeId')
			effects.consume(code)
			return idAttribute
		}
		if (code === codes.leftCurlyBrace) {
			effects.enter('attributeExpression')
			effects.consume(code)
			closeScopedValue = closeAttributeExpression
			scope.resolve(code)
			return scopedAttributeValue
		}

		effects.enter('attributeKey')
		effects.consume(code)
		return attributeKey
	}

	function closeSequence(code: Code) {
		effects.exit('attributeSequence')
		if (isEnd(code)) return beforeEnd(code)
		return effects.attempt(partialSpaceTokenizer, openSequence, openSequence)(code)
	}

	function beforeEnd(code: Code, end = done) {
		if (multipleLine && markdownLineEnding(code)) {
			effects.enter(types.lineEnding)
			effects.consume(code)
			effects.exit(types.lineEnding)
			return effects.attempt(partialSpaceTokenizer, openSequence, openSequence)
		}
		return end(code)
	}

	function done(code: Code) {
		effects.exit('attribute')
		return ok(code)
	}

	// Key

	function attributeKey(code: Code) {
		if (isEndOrSpace(code)) {
			effects.exit('attributeKey')
			return closeSequence(code)
		}
		if (code === codes.equalsTo) {
			effects.exit('attributeKey')
			return beforeOpenValue(code)
		}
		effects.consume(code)
		return attributeKey
	}

	// Value

	function beforeOpenValue(code: Code) {
		effects.enter('attributeMarker')
		effects.consume(code)
		effects.exit('attributeMarker')
		return openValue
	}

	function openValue(code: Code) {
		if (isEndOrSpace(code)) return closeSequence(code)

		effects.enter('attributeValue')
		effects.enter('attributeValueData')
		effects.consume(code)

		if (scope.canOpen(code)) {
			scope.resolve(code)
			return scopedAttributeValue
		}

		return unscopedAttributeValue
	}

	function unscopedAttributeValue(code: Code) {
		if (isEndOrSpace(code)) return closeValue(code)
		effects.consume(code)
		return unscopedAttributeValue
	}

	function scopedAttributeValue(code: Code) {
		const lineEnding = markdownLineEnding(code) && !multipleLine

		if (scope.depth === 0 || code === codes.eof || lineEnding) {
			scope.reset()
			return closeScopedValue(code)
		}

		if (markdownLineEnding(code)) {
			effects.exit('attributeValueData')
			effects.enter(types.lineEnding)
			effects.consume(code)
			effects.exit(types.lineEnding)
			effects.enter('attributeValueData')
			return scopedAttributeValue
		}
		scope.resolve(code)

		effects.consume(code)
		return scopedAttributeValue
	}

	function closeValue(code: Code) {
		effects.exit('attributeValueData')
		effects.exit('attributeValue')
		return closeSequence(code)
	}

	// Class

	function classAttribute(code: Code) {
		if (isEndOrSpace(code)) {
			effects.exit('attributeClass')
			return closeSequence(code)
		}
		effects.consume(code)
		return classAttribute
	}

	// ID

	function idAttribute(code: Code) {
		if (isEndOrSpace(code)) {
			effects.exit('attributeId')
			return closeSequence(code)
		}
		effects.consume(code)
		return idAttribute
	}

	// Expression
	function closeAttributeExpression(code: Code) {
		effects.exit('attributeExpression')
		return closeSequence(code)
	}

	return start
}

// From markdown

export const attributeFromMarkdown: FromMarkdownExtension = {
	enter: {
		attribute: enterAttribute,
		attributeSequence: enterAttributeSequence
	},
	exit: {
		attribute: exitAttirbute,
		attributeSequence: exitAttributeSequence,
		attributeKey: exitAttributeKey,
		attributeValue: exitAttributeValue,
		attributeClass: exitAttributeClass,
		attributeId: exitAttributeId,
		attributeExpression: exitAttributeExpression
	}
}

function enterAttribute(this: CompileContext): void {
	this.data.attr = {}
	this.data.exp = []
	this.data.class = []
	this.data.id = []
}

function enterAttributeSequence(this: CompileContext): void {
	delete this.data.key
}

function exitAttirbute(this: CompileContext): void {
	const data = this.data
	if (data.class && data.class.length > 0) data.attr.class = data.class
	if (data.id && data.id.length > 0) data.attr.id = data.id
	if (data.exp && data.exp.length > 0) data.attr.svelteExpression = data.exp
}

function exitAttributeSequence(this: CompileContext): void {
	if (this.data.key != null) {
		this.data.attr[this.data.key] = true
	}
}

function exitAttributeKey(this: CompileContext, token: Token): void {
	const key = this.sliceSerialize(token)
	if (/^[a-zA-Z][\w-:|]*$/.test(key)) {
		this.data.key = key
	}
}

function exitAttributeValue(this: CompileContext, token: Token): void {
	if (!this.data.key) return
	const value = this.sliceSerialize(token).replace(/^(["'])([\s\S]*)(\1)$/m, '$2')
	this.data.attr[this.data.key] = value
	delete this.data.key
}

function exitAttributeClass(this: CompileContext, token: Token): void {
	this.data.class.push(this.sliceSerialize(token).slice(1))
}

function exitAttributeId(this: CompileContext, token: Token): void {
	this.data.id.push(this.sliceSerialize(token).slice(1))
}

function exitAttributeExpression(this: CompileContext, token: Token): void {
	this.data.exp.push(this.sliceSerialize(token))
}
