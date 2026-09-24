function createThemeState() {
	let mode = $state(localStorage.getItem('decko.mode') || 'light')
	if (mode === 'dark' && !document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.add('dark')
	}

	function toggleMode() {
		document.documentElement.classList.toggle('dark')
		mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
		localStorage.setItem('decko.mode', mode)
	}

	return {
		get isDark() {
			return mode === 'dark'
		},
		toggleMode
	}
}

export const themeState = createThemeState()
