// Lib
export interface Options {
	extension?: string
}

// Component
export type SlideComponent = import('svelte').Component<SlideProps>

export interface SlideProps {
	page: number
	step: number
	showAll?: boolean
}

// Slide
export interface SlideData {
	title: string
	pages: PageData[]
	[key: string]: unknown
}

export interface SlideConfig {
	[key: string]: unknown
}

export interface PageData {
	page: number
	step?: number
	note?: string
}
