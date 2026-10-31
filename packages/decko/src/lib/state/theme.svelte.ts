const isBrowser = typeof window !== 'undefined'

function getStored(key: string, fallback: string): string {
	if (!isBrowser) return fallback
	return localStorage.getItem(key) || fallback
}

function createThemeState() {
	let mode = $state(getStored('decko.schema', 'light'))
	let theme = $state(getStored('decko.theme', 'default'))

	function applyMode() {
		document.documentElement.classList.toggle('dark', mode === 'dark')
	}

	function applyTheme() {
		document.documentElement.dataset.theme = theme
	}

	if (isBrowser) {
		applyMode()
		applyTheme()
	}

	function toggleMode() {
		mode = mode === 'dark' ? 'light' : 'dark'
		if (!isBrowser) return
		applyMode()
		localStorage.setItem('decko.schema', mode)
	}

	function changeTheme(val: string) {
		theme = val
		if (!isBrowser) return
		applyTheme()
		localStorage.setItem('decko.theme', val)
	}

	return {
		get isDark() {
			return mode === 'dark'
		},
		get theme() {
			return theme
		},
		toggleMode: toggleMode,
		changeTheme: changeTheme
	}
}

export const themeState = createThemeState()
