import { Context } from '@/context'

export type VirtualPattern = string | RegExp

export interface VirtualModule {
	staticId?: string
	prefix?: VirtualPattern
	suffix?: VirtualPattern
	params?: string
	match(id: string): boolean
	extract(id: string): Record<string, string>
	content: VirtualContent
}

export type VirtualContent = (ctx: Context) => string | PromiseLike<string>
