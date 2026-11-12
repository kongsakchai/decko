import { describe, expect, it } from 'vitest'

import * as handler from '../../src/handler'
import { imageHandler } from '../../src/handler/image'
import { linkHandler } from '../../src/handler/link'

describe('handler index', () => {
	it('should export image and link handlers', () => {
		expect(handler.imageHandler).toBe(imageHandler)
		expect(handler.linkHandler).toBe(linkHandler)
	})
})