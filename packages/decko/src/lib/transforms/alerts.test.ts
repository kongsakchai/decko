import { describe, expect, it } from 'vitest'

import { alerts } from './alerts.js'

describe('alerts', () => {
	it('should provide custom alert definitions', () => {
		expect(Object.keys(alerts)).toEqual(['info', 'example', 'bug'])

		expect(alerts.info.title).toBe('Info')
		expect(alerts.example.title).toBe('Example')
		expect(alerts.bug.title).toBe('Bug')

		for (const alert of Object.values(alerts)) {
			expect(alert.icon).toContain('<svg')
		}
	})
})
