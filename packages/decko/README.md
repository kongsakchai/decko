# @deckomd/decko

[![NPM version](https://img.shields.io/npm/v/@deckomd/decko?color=3AB9D4&label=)](https://www.npmjs.com/package/@deckomd/decko)

A Svelte preprocessor and component library for [Decko](https://github.com/kongsakchai/decko)

## Usage

Add the preprocessor to your Svelte/Vite config:

```ts
import { decko } from '@deckomd/decko'
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte'

import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		svelte({
			extensions: ['.svelte', '.svelte.md'],
			preprocess: [decko(), vitePreprocess()]
		})
	]
})
```

Then import your `.svelte.md` slides as Svelte components — the default export is the compiled slide, `slide` holds its frontmatter metadata:

```svelte
<script>
	import { SlidePlayer } from '@deckomd/decko/pages'

	import Slide, { slide } from './example/example.svelte.md'
</script>

<SlidePlayer slide={Slide} data={slide} />
```

`SlidePlayer` renders the slide with navigation (optional `width` / `height` props, 1280×720 by default).

## License

MIT License © 2026 [kongsakchai](https://github.com/kongsakchai)
