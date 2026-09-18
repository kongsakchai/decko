export interface Context {
	root: string
	markdowns: Set<string>
	read: (src: string) => string | undefined
	id: string
}

export interface VirtualModule {
	id: string | RegExp
	content: (this: Context & { id: string }) => string | PromiseLike<string>
}
