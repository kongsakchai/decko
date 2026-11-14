// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	module '*.md' {
		export const slide: import('./lib/types').SlideData

		const Component: import('./lib/types').SlideComponent
		export default Component
	}
}

export {}
