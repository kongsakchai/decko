function createThemeState() {
	let mode = $state(localStorage.getItem('decko.schema') || 'light')
	if (mode === 'dark' && !document.documentElement.classList.contains('dark')) {
		document.documentElement.classList.add('dark')
	}
	let theme = $state(localStorage.getItem('decko.theme') || 'default')
	changeTheme(theme)

	function toggleDark() {
		document.documentElement.classList.toggle('dark')
		mode = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
		localStorage.setItem('decko.schema', mode)
	}

	function changeTheme(val: string) {
		theme = val
		document.documentElement.dataset.theme = val
		localStorage.setItem('decko.theme', val)
	}

	return {
		get isDark() {
			return mode === 'dark'
		},
		get theme() {
			return theme
		},
		toggleMode: toggleDark,
		changeTheme: changeTheme
	}
}

export const themeState = createThemeState()
