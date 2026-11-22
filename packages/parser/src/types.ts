import type { Root as HastRoot, RootContent as HastRootContent } from 'hast'
import type { Node, Parent, Root, RootContent } from 'mdast'
import { Raw } from 'mdast-util-to-hast'

export type { Node, Parent, Root, RootContent }

export type Attribute = Record<string, string | number | boolean | (string | number)[] | null | undefined>

export type Directive = Record<string, unknown>

export interface SlideData {
	directive?: Directive
	title?: string
}

export interface SlideContextData extends SlideData {
	breakIndex: number
	global?: Directive
}

export interface SlideContext {
	slides: SlideContextData[]
	style: string[]
	script: string[]
	extra: Directive
}

export interface SlideInfo extends SlideData {
	index: number
	content: string
}

export interface SlideResult {
	slides: SlideInfo[]
	style: string[]
	script: string[]
	extra: Directive
}

// Transformers

export interface CodeContext {
	lang: string
	code: string
	meta: string
	attrs: Attribute
	slideCtx: SlideContext
	slide: SlideData
}

export type CodeHighlighter = (ctx: CodeContext) => Promise<HastRoot | HastRootContent | Raw>

export type CodeContainer = (ctx: CodeContext) => Promise<Parent>

export interface CodeblockOptions {
	highlighter?: CodeHighlighter
	container?: CodeContainer
}

export interface ExtensionContext {
	root: Root
	node: Node
	parents: Parent[]

	attrs: Attribute
	slideCtx: SlideContext
	currentSlide: SlideData
}

export type Extension = (ctx: ExtensionContext) => void

export interface PostExtension {
	when: (ctx: ExtensionContext) => boolean
	extension: Extension
}

export interface ExtensionOptions {
	extensions?: Extension[]
	postExtensions?: PostExtension[]
}

export interface ContainerOptions {
	customContainer?: string[]
}

export interface Alert {
	title: string
	icon?: string
}

export interface AlertOptions {
	customAlerts?: Record<string, Alert>
}
