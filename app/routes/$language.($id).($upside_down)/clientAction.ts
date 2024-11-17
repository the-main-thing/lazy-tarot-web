import { redirect, redirectDocument } from '@remix-run/react'
import type { ClientActionFunctionArgs } from '@remix-run/react'

import { pickRandomCard } from '~/utils/pickRandomCard'
import { queryClient } from '~/QueryProvider'
import {
	getKey,
	queryCardsSet,
} from '../api.$language.get-full-tarot-set.$build-timestamp/useGetCardsSet'
import { getPrevPickedCards, setPrevPickedCards } from './localStorage'
import type { GetCardsSetData } from '~/api.types' 

type Card = GetCardsSetData[0]

export type ActionData = {
	card: Card,
	upsideDown: boolean
}

export const clientAction = async ({
	request,
	params,
}: ClientActionFunctionArgs) => {
	const { language } = params
	if (!language) {
		throw redirectDocument(`/?ts=${Date.now()}`)
	}
	const formData = await request.formData()
	const cardId = formData.get('id')
	const upsideDown = formData.get('upside_down')
	const revealed = formData.get('revealed')
	if (!cardId || !upsideDown || !revealed) {
		throw redirectDocument(`/?ts=${Date.now()}`)
	}

	if (revealed === '0') {
		throw redirect(
			`/${language}/${cardId}/${upsideDown === '1' ? '1' : '0'}`,
		)
	}

	const prevPickedCards = getPrevPickedCards()

	const cardsSet = await queryClient.fetchQuery<GetCardsSetData>({
		queryKey: getKey(language),
		queryFn: () => queryCardsSet(language),
		staleTime: Infinity,
		gcTime: Infinity,
	})

	const [errorPickingRandomCard, result] = pickRandomCard({
		prevPickedCards,
		cardsSet,
		getIdFromSetItem: ({ id }) => id,
	})

	if (errorPickingRandomCard) {
		throw redirectDocument(`/${language}?ts?=${Date.now()}`)
	}

	const {
		prevPickedCards: nextHistory,
		id,
		upsideDown: nextCardUpsideDown,
	} = result
	const card = cardsSet.find((card) => card.id === id)
	if (!card) {
		console.error('Critical: cannot find picked card in cards set')
		throw redirectDocument(`/${language}?ts?=${Date.now()}`)
	}
	setPrevPickedCards(nextHistory)

	return Response.json({
		card,
		upsideDown: nextCardUpsideDown,
	})
}
