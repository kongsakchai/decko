import { VirtualModule } from './types'

export function defineVirtualModule(opts: Partial<VirtualModule> & Pick<VirtualModule, 'content'>): VirtualModule {
	const { staticId = '', prefix = '', suffix = '', params = '' } = opts

	function extractId(id: string) {
		if (id.length < prefix.length + suffix.length) return
		if (!id.startsWith(prefix) || !id.endsWith(suffix)) return
		return id.slice(prefix.length, id.length - suffix.length)
	}

	return {
		staticId,
		prefix,
		suffix,
		params,
		id(id = '') {
			return staticId || `${prefix}${id}${suffix}`
		},
		extract(id) {
			const key = params || 'params'
			return { id, [key]: staticId || (extractId(id) ?? '') }
		},
		match(id) {
			return staticId ? id === staticId : extractId(id) !== undefined
		},
		...opts
	}
}
