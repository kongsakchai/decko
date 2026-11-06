declare const __DECKO_VERSION__: string | undefined

export const version = typeof __DECKO_VERSION__ === 'undefined' ? '0.0.0-dev' : __DECKO_VERSION__
