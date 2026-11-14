import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
	initialize: vi.fn(),
	render: vi.fn()
}))

vi.mock('mermaid', () => ({ default: mocks }))

describe('mermaidRender', () => {
	let mermaidRender: typeof import('./mermaid').mermaidRender
	let container: { id: string }
	let createElement: ReturnType<typeof vi.fn>
	let appendChild: ReturnType<typeof vi.fn>

	beforeEach(async () => {
		vi.resetModules()
		vi.clearAllMocks()
		mocks.render.mockResolvedValue({ svg: '<svg></svg>' })

		container = { id: '' }
		createElement = vi.fn(() => container)
		appendChild = vi.fn()
		vi.stubGlobal('document', {
			createElement,
			body: { appendChild }
		})

		;({ mermaidRender } = await import('./mermaid'))
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	function createNode(text: string) {
		return { hidden: false, innerText: text, innerHTML: '' } as unknown as HTMLElement
	}

	it('should initialize mermaid', () => {
		expect(mocks.initialize).toHaveBeenCalledWith({ startOnLoad: false })
	})

	it('should render and cache mermaid diagrams', async () => {
		const first = createNode('graph TD; A-->B')

		mermaidRender(first)

		expect(first.hidden).toBe(true)

		await vi.waitFor(() => expect(first.hidden).toBe(false))

		expect(mocks.render).toHaveBeenCalledWith(
			expect.stringMatching(/^mermaid-[a-f0-9]{64}$/),
			'graph TD; A-->B',
			container
		)
		expect(first.innerHTML).toBe('<svg></svg>')
		expect(createElement).toHaveBeenCalledWith('div')
		expect(createElement).toHaveBeenCalledTimes(1)
		expect(appendChild).toHaveBeenCalledWith(container)
		expect(container.id).toBe('mermaid-render')

		const cached = createNode('graph TD; A-->B')

		mermaidRender(cached)
		await vi.waitFor(() => expect(cached.hidden).toBe(false))

		expect(cached.innerHTML).toBe('<svg></svg>')
		expect(mocks.render).toHaveBeenCalledTimes(1)
		expect(createElement).toHaveBeenCalledTimes(1)

		const other = createNode('graph TD; C-->D')

		mermaidRender(other)
		await vi.waitFor(() => expect(other.hidden).toBe(false))

		expect(other.innerHTML).toBe('<svg></svg>')
		expect(mocks.render).toHaveBeenCalledTimes(2)
	})
})
