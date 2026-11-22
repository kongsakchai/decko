import { Context } from '@/context'

import { slideHmrPlugin } from './hmr'
import { slideLoaderPlugin } from './loaders'
import { slideServerPlugin } from './server'

export function viteDecko(ctx: Context) {
	return Promise.all([slideHmrPlugin(ctx), slideLoaderPlugin(ctx), slideServerPlugin(ctx)])
}
