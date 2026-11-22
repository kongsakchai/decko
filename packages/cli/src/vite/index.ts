import { Context } from '@/context'

import { slideHmrPlugin } from './hmr'
import { slideLoaderPlugin } from './loaders'
import { slideServerPlugin } from './server'

export function viteDecko(ctx: Context) {
	return [slideHmrPlugin(ctx), slideLoaderPlugin(ctx), slideServerPlugin(ctx)]
}
