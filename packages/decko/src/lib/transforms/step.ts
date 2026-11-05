import type { Attribute, Extension } from '@deckomd/parser'

import { asNumber, asString } from '../logic/utils.js'

const STEP_ATTR_PATTERN = /^step-(\d+)(?:-(\d+))?$/

export type Step = [number, StepAction[]]

interface StepAction {
	class: string[]
	action: 'add' | 'remove'
}

function extractSteps(data: Attribute): { steps: Step[]; maxStep: number } {
	const steps = new Map<number, StepAction[]>()

	const appendStep = (stepStr: string, classes: string[], action: 'add' | 'remove') => {
		const step = Number.parseInt(stepStr, 10)
		if (!steps.has(step)) steps.set(step, [])
		steps.get(step)!.push({ action, class: classes })
		return step
	}

	let maxStep = asNumber(data.step) ?? 0

	for (const key in data) {
		const match = STEP_ATTR_PATTERN.exec(key)
		if (!match) continue

		const classes = asString(data[key])?.split(/\s+/).filter(Boolean)
		if (!classes || classes.length === 0) continue

		let step = appendStep(match[1], classes, 'add')
		maxStep = Math.max(maxStep, step)

		if (!match[2]) continue
		step = appendStep(match[2], classes, 'remove')
		maxStep = Math.max(maxStep, step)
	}

	return { steps: [...steps.entries()], maxStep }
}

export const stepExtension: Extension = (ctx) => {
	const stepData = extractSteps(ctx.attrs)
	if (stepData.steps.length === 0) return

	ctx.currentSlide.local ??= {}
	ctx.currentSlide.local.step = Math.max(asNumber(ctx.currentSlide.local?.step, 0), stepData.maxStep)

	const stepEntries = JSON.stringify(stepData.steps)
	ctx.attrs.svelteExpression ??= []
	const exp = ctx.attrs.svelteExpression as string[]
	exp.push(`{@attach stepper(page,${stepEntries})}`)
}
