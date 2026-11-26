import { describe, expect, it } from 'vitest'

import { imageHandler } from '../../src/handler/image.js'
import * as handler from '../../src/handler/index.js'
import { linkHandler } from '../../src/handler/link.js'

describe('handler index', () => {
	it('should export image and link handlers', () => {
		expect(handler.imageHandler).toBe(imageHandler)
		expect(handler.linkHandler).toBe(linkHandler)
	})
})
