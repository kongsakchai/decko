function createThemeState() {
	let mode = $state(localStorage.getItem('decko.schema') || 'light')
	if (mode === 'dark' && !document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.add('dark')
	}

	function toggleDark() {
		document.documentElement.classList.toggle('dark')
		mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
		localStorage.setItem('decko.schema', mode)
	}

	return {
		get isDark() {
			return mode === 'dark'
		},
		toggleMode: toggleDark
	}
}

export const themeState = createThemeState()
