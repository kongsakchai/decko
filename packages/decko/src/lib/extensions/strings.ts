import type { Attribute } from '@decko/parser'

import lz from 'lz-string'

import { asString } from '../utils'

export function compresseAttribute(attrs: Attribute, ...add: string[]) {
	const compressed = add.map((s) => lz.compressToBase64(s))
	attrs['@compressed'] = [asString(attrs['@compressed'], ''), ...compressed].filter(Boolean).join(' ')
}

export function decompresseContent(content: string) {
	for (const match of content.matchAll(/@compressed="(.*?)"/g)) {
		const decompress = match[1].split(' ').map((s) => lz.decompressFromBase64(s))
		content = content.replaceAll(match[0], decompress.join(' '))
	}
	return content
}

export function decodeAssets(content: string) {
	return content.replace(/%7B(__assets\d+)%7D/gi, '{$1}')
}
