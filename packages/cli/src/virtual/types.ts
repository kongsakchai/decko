import { Context } from '@/context'

export interface VirtualModule {
	staticId?: string
	prefix?: string
	suffix?: string
	params?: string
	content: VirtualModuleContent

	match(id: string): boolean
	extract(id: string): Record<string, string>
	id(src: string): string
}

export type VirtualModuleContent = (ctx: Context & { data: Record<string, string> }) => string | PromiseLike<string>
