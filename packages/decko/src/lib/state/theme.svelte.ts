const isBrowser = typeof window !== 'undefined'

function getStored(key: string, fallback: string): string {
	if (!isBrowser) return fallback
	return localStorage.getItem(key) || fallback
}

function createThemeState() {
	let mode = $state(getStored('decko.mode', 'light'))
	let theme = $state(getStored('decko.theme', 'default'))

	if (isBrowser) {
		applyMode()
		applyTheme()
	}

	function applyMode() {
		document.documentElement.classList.toggle('dark', mode === 'dark')
	}

	function applyTheme() {
		document.documentElement.dataset.theme = theme
	}

	return {
		get isDark() {
			return mode === 'dark'
		},
		get theme() {
			return theme
		},
		toggleMode() {
			if (!isBrowser) return
			mode = mode === 'dark' ? 'light' : 'dark'
			applyMode()
			localStorage.setItem('decko.schema', mode)
		},
		changeTheme(val: string) {
			if (!isBrowser) return
			theme = val
			applyTheme()
			localStorage.setItem('decko.theme', val)
		}
	}
}

export const themeState = createThemeState()
