<script lang="ts">
	import { SlideContext, ViewContext } from '@deckomd/decko/context/index.js'
	import { getThemes } from '@deckomd/decko/logic/themes'
	import { asString } from '@deckomd/decko/logic/utils'
	import { themeState } from '@deckomd/decko/state'
	import type { SlideData } from '@deckomd/decko/types.js'
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
		untrack(() => getThemes(data.themes) ?? [])
	)
</script>

{@render children?.()}
