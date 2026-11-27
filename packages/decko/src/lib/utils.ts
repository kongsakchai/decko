export function asNumber(v: unknown, defaultVal: number): number
export function asNumber(v: unknown, defaultVal?: undefined): number | undefined
export function asNumber(v: unknown, defaultVal?: number): number | undefined {
	return typeof v === 'number' ? v : defaultVal
}

export function asString(v: unknown, defaultVal: string): string
export function asString(v: unknown, defaultVal?: undefined): string | undefined
export function asString(v: unknown, defaultVal?: string): string | undefined {
	return typeof v === 'string' ? v : defaultVal
}

export function mergeStr(separator: string, ...v: unknown[]): string {
	return v.filter(Boolean).join(separator)
}

export function asStringArray(v: unknown, unique?: boolean): string[] | undefined {
	const raw = typeof v === 'string' ? v.split(',') : Array.isArray(v) ? v : undefined
	if (!raw) return undefined

	const list = raw
		.filter((t) => typeof t === 'string')
		.map((t) => t.trim())
		.filter(Boolean)

	return unique ? uniqueArray(list) : list
}

export function uniqueArray<T>(v: T[]) {
	return [...new Set(v)]
}
