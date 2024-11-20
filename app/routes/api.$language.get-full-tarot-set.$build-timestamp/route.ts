import { type LoaderFunctionArgs } from '@remix-run/node'

import { api, CardsSet } from '~/api.server'
import { getItem, setItem } from '~/cache-storage.server'
import { getLanguageFromParams } from '~/utils/i18n.server'

const MINUTE_IN_SECONDS = 60
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60

const getData = async (language: string) => {
	const key = JSON.stringify(['tarot', 'cards-set', language])
	const cached = await getItem(key)
	if (cached) {
		return [JSON.parse(cached) as CardsSet, null] as const
	}
	const [data, error] = await api.getCardsSet(language)
	if (error) {
		return [null, error] as const
	}
	void setItem(key, JSON.stringify(data))
	return [data, null] as const
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
	const language = getLanguageFromParams(params)?.code
	if (!language) {
		throw new Response(null, { status: 404 })
	}

	const [data, error] = await getData(language);
	if (error) {
		throw error
	}

	return Response.json(data, {
		headers: {
			'Cache-Control': `public, max-age=${HOUR_IN_SECONDS * 3
				}, stale-while-revalidate=${HOUR_IN_SECONDS * 3}`,
		},
	})
}

export type LoaderData = CardsSet
