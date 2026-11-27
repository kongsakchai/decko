<script lang="ts">
	import PalleteIcon from '@/icons/pallete-icon.svelte'
	import { twMerge } from 'tailwind-merge'
	import Popover from './popover.svelte'

	interface Props {
		class?: string
		position?: 'top' | 'bottom'
		isDark?: boolean
		themes?: string[]
		theme?: string
	}

	let { class: className, position, theme = $bindable('default'), isDark, themes = [] }: Props = $props()
</script>

<Popover
	title="theme"
	triggerClass={twMerge('relative h-8.5 w-8.5 appearance-none overflow-hidden rounded-md', className)}
	contentClass="bottom-4 top-4 bg-card text-card-foreground border-border rounded-md border p-1 flex-col"
	{position}
>
	{#snippet trigger()}
		<PalleteIcon />
	{/snippet}

	{#snippet content()}
		{#each themes as t (t)}
			<button
				class:dark={isDark}
				data-theme={t}
				class:bg-accent={t === theme}
				class:text-accent-foreground={t === theme}
				class="hover:bg-accent hover:text-accent-foreground box-content flex min-w-30 items-center gap-2 rounded-md px-2 py-0.5"
				onclick={() => (theme = t)}
			>
				<div class="grid grid-cols-2 grid-rows-2 gap-px">
					<div class="border-border bg-primary h-2 w-2 rounded-md border"></div>
					<div class="border-border bg-secondary h-2 w-2 rounded-md border"></div>
					<div class="border-border bg-accent h-2 w-2 rounded-md border"></div>
					<div class="border-border bg-background h-2 w-2 rounded-md border"></div>
				</div>
				{t}
			</button>
		{/each}
	{/snippet}
</Popover>
