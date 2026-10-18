<script lang="ts">
	import { FileExplorer, SwitchThemeMode } from '../components'

	interface Props {
		title: string
		files: string[]
	}

	let { title, files }: Props = $props()
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<main class="bg-background box-border h-dvh w-full overflow-y-scroll px-6 pt-1 transition-all duration-500">
	<section class="flex items-center justify-between">
		<h1>{title}</h1>

		<SwitchThemeMode
			class="bg-card text-card-foreground border-border hover:bg-accent hover:text-accent-foreground border active:scale-90"
		/>
	</section>

	<FileExplorer {files} />
</main>
