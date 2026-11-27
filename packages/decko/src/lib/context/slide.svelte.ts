import { isBrowser } from '@/logic/events.js'
import type { SlideData } from '@/types.js'

import { createContext } from 'svelte'

export enum Action {
	NEXT,
	NEXT_PAGE,
	PREVIOUS,
	PREV_PAGE,
	JUMP
}

const [get, set] = createContext<SlideContext>()

export class SlideContext {
	slide = $state<SlideData>({ title: '', pages: [] })

	#page = $state(1)
	#step = $state(0)
	#action = $state<Action>(Action.NEXT)

	constructor(slide: SlideData) {
		this.slide = slide

		if (isBrowser() && window.location.hash) {
			const page = Number.parseInt(window.location.hash.slice(1))
			if (!Number.isNaN(page)) this.goto(page)
		}

		$effect(() => {
			navigation.navigate(`#${this.page}`, { history: 'replace' })
		})
	}

	static create(slide: SlideData) {
		return set(new SlideContext(slide))
	}

	static get() {
		return get()
	}

	get page() {
		return this.#page
	}
	get step() {
		return this.#step
	}
	get action() {
		return this.#action
	}
	get totalPage() {
		return this.slide.pages.length
	}

	pageStep(page = this.page) {
		if (page < 1 || page > this.totalPage) return 0
		return this.slide.pages[page - 1]?.step ?? 0
	}

	goto(page: number, step = 0, action = Action.JUMP) {
		page = Math.max(1, Math.min(page, this.totalPage))
		step = Math.max(0, Math.min(step, this.pageStep(page)))

		if (page === this.page && step === this.step) return

		this.#page = page
		this.#step = step
		this.#action = action
	}

	next() {
		if (this.step < this.pageStep()) {
			this.goto(this.page, this.step + 1, Action.NEXT)
		} else if (this.page < this.totalPage) {
			this.goto(this.page + 1, 0, Action.NEXT_PAGE)
		}
	}

	previous() {
		if (this.step > 0) {
			this.goto(this.page, this.step - 1, Action.PREVIOUS)
		} else if (this.page > 1) {
			this.goto(this.page - 1, this.pageStep(this.page - 1), Action.PREV_PAGE)
		}
	}
}
