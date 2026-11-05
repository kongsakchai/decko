<script lang="ts">
	import { FileExplorer, ThemeToggle } from '../components/index.js'

	interface Props {
		title: string
		files: string[]
	}

	let { title, files }: Props = $props()
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main
	data-theme="default"
	class="bg-background box-border h-dvh w-full overflow-y-scroll px-6 pt-1 transition-all duration-500"
>
	<section class="flex items-center justify-between">
		<h1>{title}</h1>

		<ThemeToggle
			class="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground border active:scale-90"
		/>
	</section>

	<FileExplorer {files} />
</main>
