import { Context } from '@/context'

import { slideHmrPlugin } from './hmr.js'
import { slideLoaderPlugin } from './loaders.js'
import { slideServerPlugin } from './server.js'

export function viteDecko(ctx: Context) {
	return [slideHmrPlugin(ctx), slideLoaderPlugin(ctx), slideServerPlugin(ctx)]
}
