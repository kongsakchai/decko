import { PersistedState } from './persisted.svelte.js'

export const fontScaleState = new PersistedState<number>('decko-font-scale', 1)
export const slideScaleState = new PersistedState<number>('decko-slide-scale', 1)
