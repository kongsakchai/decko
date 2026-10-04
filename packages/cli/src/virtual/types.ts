import { Context } from '@/context'

export interface VirtualModuleRoute {
	staticId?: string
	prefix?: string
	suffix?: string
	params?: string
	module: VirtualModule

	match(id: string): boolean
	extract(id: string): string | undefined
	parse(id: string): Record<string, string>
	id(src: string): string
}

export interface VirtualModule {
	content: (ctx: Context & { data: Record<string, string> }) => string | PromiseLike<string>
}
