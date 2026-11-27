<script lang="ts">
	import { SlideContext, ViewContext } from '@/context/index.js'
	import { themeState } from '@/state/index.js'
	import type { SlideData } from '@/types.js'
	import { asString, asStringArray } from '@/utils.js'
	import { untrack, type Snippet } from 'svelte'

	interface Props {
		data: SlideData
		children?: Snippet
		width?: number
		height?: number
	}

	const { data, children, width = 1280, height = 720 }: Props = $props()

	SlideContext.create(untrack(() => data))

	ViewContext.create(
		untrack(() => width),
		untrack(() => height)
	)

	themeState.setup(
		untrack(() => asString(data.theme, '')),
		untrack(() => asStringArray(data.themes) ?? [])
	)
</script>

{@render children?.()}
