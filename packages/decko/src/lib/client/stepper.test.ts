import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Step } from '../transforms/step.js'
import { stepper } from './stepper'

const mocks = vi.hoisted(() => ({
	context: {
		page: 1,
		step: 0,
		action: 0
	}
}))

vi.mock('../context/index.js', () => ({
	Action: { PREVIOUS: 2 },
	useSlideContext: () => mocks.context
}))

const steps: Step[] = [
	[1, [{ action: 'add', class: ['active'] }]],
	[2, [{ action: 'remove', class: ['active'] }]]
]

function createNode() {
	const add = vi.fn()
	const remove = vi.fn()

	return {
		node: { classList: { add, remove } } as unknown as HTMLElement,
		add,
		remove
	}
}

describe('stepper', () => {
	beforeEach(() => {
		mocks.context.page = 1
		mocks.context.step = 0
		mocks.context.action = 0
	})

	it('should do nothing when the page does not match', () => {
		const { node, add, remove } = createNode()

		stepper(2, steps)(node)

		expect(add).not.toHaveBeenCalled()
		expect(remove).not.toHaveBeenCalled()
	})

	it('should add and remove classes when moving forward', () => {
		const { node, add, remove } = createNode()
		const attach = stepper(1, steps)

		mocks.context.step = 2
		attach(node)

		expect(add).toHaveBeenCalledWith('active')
		expect(remove).toHaveBeenCalledWith('active')

		attach(node)

		expect(add).toHaveBeenCalledTimes(1)
		expect(remove).toHaveBeenCalledTimes(1)
	})

	it('should restore classes when moving backward', () => {
		const { node, add, remove } = createNode()
		const attach = stepper(1, steps)

		mocks.context.step = 2
		attach(node)

		add.mockClear()
		remove.mockClear()

		mocks.context.step = 0
		mocks.context.action = 2
		attach(node)

		expect(add).toHaveBeenCalledWith('active')
		expect(remove).toHaveBeenCalledWith('active')
	})
})
