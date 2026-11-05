declare const __DECKO_VERSION__: string | undefined

// `__DECKO_VERSION__` is injected by tsdown's `define` at build time.
// When running from source (tsx/bun dev) the macro never exists, so fall back.
export const version = typeof __DECKO_VERSION__ === 'undefined' ? '0.0.0-dev' : __DECKO_VERSION__
