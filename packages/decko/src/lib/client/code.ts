export function initCopyCode() {
	if (typeof window === 'undefined') return
	window.copyCode = (e: Event) => {
		const button = e.currentTarget as HTMLButtonElement
		const pre = button.parentNode?.querySelector('pre')
		if (!pre) return

		navigator.clipboard
			.writeText(pre.textContent)
			.then(() => {
				button.classList.add('copied')
				setTimeout(() => {
					button.classList.remove('copied')
				}, 1000)
			})
			.catch((e) => {
				console.log('copy fail', e)
			})
	}
}

declare global {
	interface Window {
		copyCode: (e: Event) => void
	}
}
