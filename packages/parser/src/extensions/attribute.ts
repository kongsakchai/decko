import type { CompileContext, Extension as FromMarkdownExtension } from 'mdast-util-from-markdown'
import { markdownLineEnding, markdownLineEndingOrSpace } from 'micromark-util-character'
import { codes } from 'micromark-util-symbol'
import type { Code, Effects, State, Token } from 'micromark-util-types'

import { partialSpaceTokenizer } from './space.js'

export const isQuote = (code: Code) =>
	code === codes.quotationMark || code === codes.apostrophe || code === codes.graveAccent

// Tokenize

export function createAttributeTokenize(effects: Effects, ok: State, nok: State, closeCode: Code) {
	let markers: Code[] = []
	let closeScopedValue = closeValue

	const latestMarker = () => markers.at(-1) ?? null
	const isEnd = (code: Code) => code === codes.eof || markdownLineEnding(code) || code === closeCode
	const isEndOrSpace = (code: Code) => code === codes.eof || markdownLineEndingOrSpace(code) || code === closeCode

	// Entry

	function start(code: Code) {
		if (isEnd(code)) return nok(code)
		effects.enter('attribute')
		return effects.attempt(partialSpaceTokenizer, openSequence, openSequence)(code)
	}

	function openSequence(code: Code) {
		if (isEnd(code)) return done(code)
		effects.enter('attributeSequence')

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
			markers.push(code)
			return scopedAttributeValue
		}

		effects.enter('attributeKey')
		effects.consume(code)
		return attributeKey
	}

	function closeSequence(code: Code) {
		effects.exit('attributeSequence')
		if (isEnd(code)) return done(code)
		return effects.attempt(partialSpaceTokenizer, openSequence, openSequence)(code)
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
		effects.consume(code)

		if (isQuote(code) || code === codes.leftCurlyBrace) {
			markers.push(code)
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
		if (latestMarker() == null || code === codes.eof || markdownLineEnding(code)) {
			markers = []
			return closeScopedValue(code)
		}

		if (code === codes.rightCurlyBrace && latestMarker() === codes.leftCurlyBrace) {
			markers.pop()
		} else if (isQuote(code) && latestMarker() === code) {
			markers.pop()
		} else if (isQuote(code) || code === codes.leftCurlyBrace) {
			markers.push(code)
		}

		effects.consume(code)
		return scopedAttributeValue
	}

	function closeValue(code: Code) {
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
		attributeKey: exitAttributeKey,
		attributeValue: exitAttributeValue,
		attributeClass: exitAttributeClass,
		attributeID: exitAttributeID,
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
	this.data.key = undefined
}

function exitAttributeKey(this: CompileContext, token: Token): void {
	const key = this.sliceSerialize(token)
	if (/^[a-zA-Z][\w-:|]*$/.test(key)) {
		this.data.key = key
	}
}

function exitAttributeValue(this: CompileContext, token: Token): void {
	if (!this.data.key) return
	const value = this.sliceSerialize(token).replace(/^(["'])(.*)(\1)$/, '{$2}')
	this.data.attr[this.data.key] = value
}

function exitAttributeClass(this: CompileContext, token: Token): void {
	this.data.class.push(this.sliceSerialize(token).slice(1))
}

function exitAttributeID(this: CompileContext, token: Token): void {
	this.data.id.push(this.sliceSerialize(token).slice(1))
}

function exitAttributeExpression(this: CompileContext, token: Token): void {
	this.data.exp.push(this.sliceSerialize(token))
}
