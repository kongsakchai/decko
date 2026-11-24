<script lang="ts">
	import Appearance from './appearance-control.svelte'
	import ControlRoot from './control-root.svelte'
	import Navigation from './navigation-control.svelte'
	import ViewContral from './view-control.svelte'
</script>

<ControlRoot
	class=" absolute bottom-0 left-0 flex gap-4 p-6 opacity-0 transition-all delay-1000 duration-300 hover:opacity-100 hover:delay-0 has-[:popover-open]:opacity-100 has-[:popover-open]:delay-0"
>
	<Navigation />
	<ViewContral />
	<Appearance />
</ControlRoot>
