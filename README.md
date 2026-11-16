# Decko

Turn Markdown into slide decks, with Svelte when you need it.

## Installation

```sh
npm install -g @deckomd/cli
```

Then start the dev server with a slide file:

```sh
decko serve slide.md
```

## Documentation

- [syntax.md](./docs/syntax.md) for the full syntax reference.

## Packages

This is a monorepo containing `decko` and its supporting packages. Each package has its own readme with more details.

- [decko](https://github.com/kongsakchai/decko/tree/main/packages/decko) - A Svelte preprocessor and component library for Decko.
- [parser](https://github.com/kongsakchai/decko/tree/main/packages/parser) - Markdown slide decks parser for Decko.
- [cli](https://github.com/kongsakchai/decko/tree/main/packages/cli) - The CLI for Decko: build slide decks from Markdown, with Svelte when you need it.
