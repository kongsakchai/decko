<script lang="ts">
	import ControlRoot from './control-root.svelte'
	import ThemeSelector from './theme-selector.svelte'
	import ThemeToggle from './theme-toggle.svelte'
</script>

<ControlRoot class=" fixed top-0 left-0 flex gap-4 p-6 ">
	<div class="menu">
		<ThemeToggle class="menu-btn rounded-l-sm" />

		<div class=" border-border border-l"></div>

		<ThemeSelector class="menu-btn" position="bottom" />
	</div>
</ControlRoot>
