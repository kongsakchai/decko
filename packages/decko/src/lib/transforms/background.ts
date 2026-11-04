import { type Directive } from '@deckomd/parser'

const BACKGROUND_PROPS = {
	bg: 'background',
	'bg-color': 'background-color',
	'bg-image': 'background-image',
	'bg-size': 'background-size',
	'bg-position': 'background-position',
	'bg-opacity': 'opacity',
	'bg-filter': 'filter'
} as const satisfies Record<string, string>

type BackgroundKey = keyof typeof BACKGROUND_PROPS

export function toBackgroundStyles(directive: Directive): string {
	return (Object.entries(BACKGROUND_PROPS) as [BackgroundKey, string][])
		.filter(([key]) => typeof directive[key] === 'string')
		.map(([key, prop]) => `${prop}: ${directive[key] as string}`)
		.join(';')
}
