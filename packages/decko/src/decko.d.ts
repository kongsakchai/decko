declare module '*.md' {
	export const slide: import('./lib/types').SlideData

	const Component: import('./lib/types').SlideComponent
	export default Component
}
