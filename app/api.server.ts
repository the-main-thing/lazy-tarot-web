import { z } from 'zod'
import { env } from './utils/env.server'

let apiEndpoint = env.API_ENDPOINT
apiEndpoint = apiEndpoint.endsWith('/') ? apiEndpoint.slice(0, -1) : apiEndpoint

import type { Router } from './api.types'

function endpoint(path: `/${string}`, ...params: Array<string>): URL {
	path = `${path}/${params.filter(Boolean).join('/')}`
	if (path.endsWith('/')) {
		return new URL(path.slice(-1), apiEndpoint)
	}
	return new URL(path, apiEndpoint)
}

function headers() {
	return new Headers({
		"Accept": "application/json",
		"Content-Type": "application/json",
		'x-api-key': env.LAZY_TAROT_API_KEY
	})
}

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

async function getAllPages(language: string) {
	const response = await fetch(endpoint('/get-all-pages/', language), {
		method: 'GET',
		headers: headers(),
	})
	return await response.json() as Router['get-all-pages']['data']
}

const prevPickedCardsInputSchema = z.object({
	prevPickedCards: z.array(
		z.object({ id: z.string(), upsideDown: z.boolean() }),
	),
})

async function getRandomCard(language: string, prevPickedCards: z.infer<typeof prevPickedCardsInputSchema>) {
	const response = await fetch(endpoint('/get-random-card', language), {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ prevPickedCards: prevPickedCardsInputSchema.parse(prevPickedCards) })
	})
	return await response.json() as Router['get-random-card']['data']
}

async function getCardsSet(language: string) {
	const response = await fetch(endpoint('/get-cards-set', language), {
		method: 'GET',
		headers: headers(),
	})
	return await response.json() as Router['get-cards-set']['data']
}

async function getCardById(language: string, id: string) {
	const response = await fetch(endpoint('/get-card-by-id', language, id), {
		method: 'GET',
		headers: headers(),
	})
	return await response.json() as Router['get-card-by-id']['data']
}

export const api = {
	getAllPages: withError(getAllPages),
	getRandomCard: withError(getRandomCard),
	getCardsSet: withError(getCardsSet),
	getCardById: withError(getCardById),
} as const
