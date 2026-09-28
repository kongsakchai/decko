import { Root } from 'mdast'
import type { Transformer } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

import { Alert, AlertOptions } from '../types.js'

const ALERT_TYPE_REGEX = /^\[!(\w+)\] ?(\w+)?/

const defaultAlert: Record<string, Alert> = {
	note: {
		title: 'Note',
		icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info preview-icon"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`
	},
	tip: {
		title: 'Tip',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-lightbulb preview-icon"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>'
	},
	important: {
		title: 'Important',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-warning preview-icon"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M12 15h.01"/><path d="M12 7v4"/></svg>'
	},
	warning: {
		title: 'Warning',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-triangle-alert preview-icon"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
	},
	caution: {
		title: 'Caution',
		icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-octagon-alert preview-icon"><path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/></svg>'
	}
}

export function alertTransformer(options?: AlertOptions): Transformer {
	const alertList = { ...defaultAlert, ...options?.customAlerts }

	return (tree) => {
		visit(tree as Root, 'blockquote', (node, index, parent) => {
			if (typeof index !== 'number' || !parent) return
			if (node.children.length === 0) return

			const first = node.children[0]
			if (first.type !== 'paragraph' || first.children.length === 0 || first.children[0].type !== 'text') return
			const text = first.children[0]

			const match = ALERT_TYPE_REGEX.exec(text.value)
			if (!match) return

			const key = match[1].toLowerCase()
			const alert = alertList[key]
			if (!alert) return
			text.value = text.value.replace(match[0], '')

			node.data ??= { hProperties: {} }
			node.data.hProperties = { ...node.data.hProperties, alert: key }

			node.children.splice(0, 0, {
				type: 'paragraph',
				data: {
					hProperties: {
						style: `display:flex; gap:8px; align-items:center;`,
						class: 'alert-title'
					}
				},
				children: [
					{
						type: 'html',
						value: alert.icon ?? ''
					},
					{
						type: 'text',
						value: match[2] ?? alert.title
					}
				]
			})

			return SKIP
		})
	}
}
