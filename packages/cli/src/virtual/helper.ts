import { VirtualModuleRoute } from './types'

export function defineVirtualRoute(
	opts: Partial<VirtualModuleRoute> & Pick<VirtualModuleRoute, 'module'>
): VirtualModuleRoute {
	const { staticId = '', prefix = '', suffix = '', params = '' } = opts

	return {
		id(id = '') {
			if (staticId) return staticId
			return `${prefix}${id}${suffix}`
		},
		extract(id) {
			if (staticId) return staticId
			if (id.length < prefix.length + suffix.length) return
			if (!id.startsWith(prefix) || !id.endsWith(suffix)) return
			return id.slice(prefix.length, id.length - suffix.length)
		},
		parse(id) {
			const key = params ?? 'params'
			const extract = this.extract(id) ?? ''
			return { id, [key]: extract }
		},
		match(id) {
			if (staticId) return staticId == id
			return id.startsWith(prefix) && id.endsWith(suffix)
		},
		...opts
	}
}
