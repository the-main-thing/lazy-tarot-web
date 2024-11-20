import { z } from 'zod'
import { env } from './utils/env.server'
import { ApiClient } from 'tarot-api'

type ApiData = {
	[key in keyof ApiClient]: Awaited<ReturnType<ApiClient[key]>>
}

type ApiMethod<TKey extends keyof ApiClient> = (...parameters: Parameters<ApiClient[TKey]>) =>
	Promise<ApiData[TKey]>

let apiEndpoint = env.API_ENDPOINT
apiEndpoint = apiEndpoint.endsWith('/') ? apiEndpoint.slice(0, -1) : apiEndpoint

const client = new ApiClient(fetch, apiEndpoint as `http${string}`, env.LAZY_TAROT_API_KEY)

function withError<
	TCallback extends (...args: Array<any>) => any
>(callback: TCallback): (...args: Parameters<TCallback>) => Promise<[Awaited<ReturnType<TCallback>>, null] | [null, { error: unknown }]> {
	return async (...args: Parameters<TCallback>) => {
		try {
			return [await callback(...args), null]
		} catch (error) {
			return [null, { error }]
		}
	}
}

const prevPickedCardsInputSchema = z.array(
	z.object({ id: z.string(), upsideDown: z.boolean() }).strip(),
)

const validateLanugage = (language: string): void => {
	if (typeof language !== 'string' || language.length < 2 || language.length > 6) {
		throw new Error('Invalid language parameter')
	}
}

const getRandomCard: ApiMethod<'getRandomCard'> = async (language, prevPickedCards) => {
	validateLanugage(language)
	if (prevPickedCards?.length > 100) {
		throw new Error('prevPickedCards is too big')
	}
	return client.getRandomCard(language, prevPickedCardsInputSchema.parse(prevPickedCards))
}
const getAllPages: ApiMethod<'getAllPages'> = (language) => {
	validateLanugage(language)
	return client.getAllPages(language)
}
const getCardsSet: ApiMethod<'getCardsSet'> = (language) => {
	validateLanugage(language)
	return client.getCardsSet(language)
}
const getCardById: ApiMethod<'getCardById'> = (language, id) => {
	validateLanugage(language)
	if (!id || id.length > 200) {
		throw new Error('Invalid id')
	}
	return client.getCardById(language, id)
}

export const api = {
	getAllPages: withError(getAllPages),
	getRandomCard: withError(getRandomCard),
	getCardsSet: withError(getCardsSet),
	getCardById: withError(getCardById),
} as const


export type AllPages = ApiData['getAllPages']
export type CardsSet = ApiData['getCardsSet']
export type Card = CardsSet[number]
