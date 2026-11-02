export function resolvePaginate(paginate: unknown, current: number) {
	return {
		show: paginate === true || paginate === 'hold',
		current: paginate !== 'skip' && paginate !== 'hold' ? current + 1 : current
	}
}
