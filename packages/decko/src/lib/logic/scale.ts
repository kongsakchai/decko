export function calScale(viewportWidth: number, viewportHeight: number, width: number, height: number) {
	if (viewportWidth <= 0 || viewportHeight <= 0 || width <= 0 || height <= 0) {
		return 0
	}

	const aspect = width / height
	const scaledHeight = viewportWidth / aspect
	const finalWidth = scaledHeight > viewportHeight ? viewportHeight * aspect : viewportWidth

	return finalWidth / width
}
