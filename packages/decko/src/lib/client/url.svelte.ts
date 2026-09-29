import { useSlideContext } from '@decko/decko/context'

export function useURLState() {
	const ctx = useSlideContext()

	if (window.location.hash) {
		const page = Number.parseInt(window.location.hash.slice(1))
		ctx.goto(page)
	}

	$effect(() => {
		navigation.navigate(`#${ctx.page}`, { history: 'replace' })
	})
}
