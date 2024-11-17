import { redirect } from '@remix-run/node'
import { api } from '~/api.server'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { getSSRData } from './components/Deck'
import { getItem, setItem, removeItem } from '~/cache-storage.server'
import type { GetAllPagesData, TarotCard } from '~/api.types'

const HOUR_IN_SECONDS = 60 * 60

export type Loader = typeof loader
export type LoaderData = {
	card: TarotCard,
	deckSSRData: ReturnType<typeof getSSRData>,
	content: GetAllPagesData,
	upsideDown: boolean,
	revealed: boolean,
	host: string,
	language: string,
}

const getContent = async (language: string) => {
	const key = JSON.stringify(['content', language])
	const value = await getItem(key);
	if (value) {
		try {
			return [JSON.parse(value) as GetAllPagesData, null] as const
		} catch (error) {
			console.error(new Date(), 'getContent cannot parse cached value\n', error)
			await removeItem(key)
		}

	}

	const [data, error] = await api.getAllPages(language)
	if (error) {
		return [null, error] as const
	}
	await setItem(key, JSON.stringify(data))
	return [data, null] as const
}

async function getCardById({ language, id }: { language: string, id: string }) {
	const key = JSON.stringify(['tarot', 'card', language, id])
	const value = await getItem(key)
	if (value) {
		try {
			return [JSON.parse(value) as TarotCard | null, null] as const
		} catch (error) {
			console.error(new Date(), 'getCardById cannot JSON.parse cached value\n', error)
			await removeItem(key)
		}
	}

	const [data, error] = await api.getCardById(language, id)
	if (error) {
		return [null, error] as const
	}

	await setItem(key, JSON.stringify(data))
	return [data, null] as const
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { id, upside_down, language } = params
	if (!language) {
		throw redirect('/')
	}
	const contentPromise = getContent(language)

	if (id && (upside_down == '1' || upside_down == '0')) {
		const [cardResponse, contentResponse] = await Promise.all([
			getCardById({ language, id }),
			contentPromise,
		])

		const [card, errorGettingCard] = cardResponse
		if (errorGettingCard) {
			console.error(new Date(), 'got error while getting card by id\n', errorGettingCard)
			throw redirect('/')
		}
		const [content, errorGettingContent] = contentResponse
		if (errorGettingContent) {
			console.error(new Date(), 'got error while getting content for pages\n', errorGettingContent)
			throw new Response('Something is completely broken on the server', {
				status: 500,
				statusText: 'Internal error'
			})
		}

		if (card) {
			return Response.json({
				card,
				deckSSRData: getSSRData(true),
				content,
				upsideDown: upside_down === '1',
				revealed: true,
				host: new URL(request.url).origin,
				language,
			} satisfies LoaderData, {
				headers: {
					'Cache-Control': `public, max-age=${HOUR_IN_SECONDS * 3
						}, stale-while-revalidate=${HOUR_IN_SECONDS * 3}`,
				}
			})
		}

		throw redirect(`/${language}`)
	}

	const [nextCardResponse, contentResponse] = await Promise.all([
		api.getRandomCard(
			language,
			{ prevPickedCards: [] },
		),
		contentPromise,
	])


	const [card, errorGettingCard] = nextCardResponse
	const [content, errorGettingContent] = contentResponse
	if (errorGettingCard) {
		console.error(new Date(), 'got error getting random card\n', errorGettingCard)
		throw new Response('Something is completely broken on the server', {
			status: 500,
			statusText: 'Internal error'
		})
	}
	if (errorGettingContent) {
		console.error(new Date(), 'got error getting content\n', errorGettingContent)
		throw new Response('Something is completely broken on the server', {
			status: 500,
			statusText: 'Internal error'
		})
	}

	return Response.json({
		card,
		deckSSRData: getSSRData(false),
		content,
		upsideDown: Math.random() > 0.5,
		revealed: false,
		host: new URL(request.url).origin,
		language,
	} satisfies LoaderData, {
		headers: {
			'Cache-Control': 'no-store'
		}
	})
}

