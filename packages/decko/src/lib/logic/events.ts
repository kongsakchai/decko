export function isBrowser() {
	return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function onBrowser(fn: () => unknown) {
	if (isBrowser()) fn()
}
