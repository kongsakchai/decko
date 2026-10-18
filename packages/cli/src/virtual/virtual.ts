import { VirtualModule } from './types'

export function defineVirtualModule(opts: Partial<VirtualModule> & Pick<VirtualModule, 'content'>): VirtualModule {
	const { staticId = '', prefix, suffix, params = '' } = opts

	function matchStart(str?: string) {
		if (!str) return
		if (!prefix) return str
		if (typeof prefix === 'string') {
			return str.startsWith(prefix) ? str.slice(prefix.length) : undefined
		}
		const m = new RegExp(`^(?:${prefix.source})`).exec(str)
		return m ? str.slice(m[0].length) : undefined
	}

	function matchEnd(str?: string) {
		if (!str) return
		if (!suffix) return str
		if (typeof suffix === 'string') {
			return str.endsWith(suffix) ? str.slice(0, -suffix.length) : undefined
		}
		const m = new RegExp(`(?:${suffix.source})$`).exec(str)
		return m ? str.slice(0, -m[0].length) : undefined
	}

	return {
		staticId,
		prefix,
		suffix,
		params,
		extract(id) {
			const key = this.params || 'params'
			return { id, [key]: staticId || matchEnd(matchStart(id)) || '' }
		},
		match(id) {
			return staticId ? id === staticId : matchEnd(matchStart(id)) !== undefined
		},
		...opts
	}
}
