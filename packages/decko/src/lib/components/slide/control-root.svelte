<script lang="ts">
	import type { Snippet } from 'svelte'
	import ControlRoot from '../control-root.svelte'

	interface Props {
		children: Snippet
	}

	let { children }: Props = $props()
</script>

<ControlRoot
	class="absolute bottom-0 left-0 flex gap-4 p-6 opacity-0 transition-all delay-1000 duration-300 hover:opacity-100 hover:delay-0 has-[:popover-open]:opacity-100 has-[:popover-open]:delay-0"
>
	{@render children()}
</ControlRoot>
