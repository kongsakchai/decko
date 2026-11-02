export function onBrowser(fn: () => unknown) {
	if (typeof window !== 'undefined') fn()
}
