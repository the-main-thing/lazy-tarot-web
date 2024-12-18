import { useReducer, useState } from 'react'

import { matches } from './matches'
import type { AnimationState, AnimationEvent, TransitionsMap } from './types'
import type { ActionData } from '../clientAction'
import type { useRouteLoadersData } from '../RouteLoadersDataProvider'
import { useParams } from '@remix-run/react'
import { useGetCardsSet } from '~/routes/api.$language.get-full-tarot-set.$build-timestamp/useGetCardsSet'

const inBrowser = () => typeof window !== 'undefined'

const transitionsMap: TransitionsMap = {
	idle_ssr_hidden: {
		REVEAL: () => {
			return inBrowser()
				? 'revealing_pre_animate_scroll'
				: 'idle_ssr_revealed'
		},
	},
	idle_ssr_revealed: {
		HIDE: () => {
			return inBrowser() ? 'hiding_pre_animate_scroll' : 'idle_ssr_hidden'
		},
	},
	idle_hidden: {
		REVEAL: () => {
			return 'revealing_pre_animate_scroll'
		},
	},
	idle_revealed: {
		HIDE: () => {
			return 'hiding_pre_animate_scroll'
		},
	},
	hiding_pre_animate_scroll: {
		PREANIMATE_END_SCROLL: () => {
			return 'hiding_pre_animate_hide_content'
		},
		REVEAL: () => {
			return 'idle_revealed'
		},
	},
	hiding_pre_animate_hide_content: {
		PREANIMATE_END_HIDE_CONTENT: () => {
			return 'hiding_wiping_deck_off'
		},
		REVEAL: () => {
			return 'revealing_revealing_content'
		},
	},
	hiding_wiping_deck_off: {
		DECK_WIPED_OFF: () => {
			return 'hiding_replacing_deck'
		},
		REVEAL: () => {
			return 'revealing_flipping_card'
		}
	},
	hiding_replacing_deck: {
		DECK_REPLACED: () => {
			return 'hiding_revealing_content'
		},
		REVEAL: () => {
			return 'revealing_replacing_deck'
		}
	},
	hiding_revealing_content: {
		HIDDEN_CONTENT_REVEALED: () => {
			return 'idle_hidden'
		},
		REVEAL: () => {
			return 'revealing_flipping_card'
		},
	},
	revealing_pre_animate_scroll: {
		PREANIMATE_END_SCROLL: () => {
			return 'revealing_pre_animate_hide_content'
		},
		HIDE: () => {
			return 'idle_hidden'
		},
	},
	revealing_pre_animate_hide_content: {
		PREANIMATE_END_HIDE_CONTENT: () => {
			return 'revealing_flipping_card'
		},
		HIDE: () => {
			return 'idle_hidden'
		},
	},
	revealing_flipping_card: {
		CARD_FLIPPED: () => {
			return 'revealing_replacing_deck'
		},
		HIDE: () => {
			return 'hiding_revealing_content'
		},
	},
	revealing_replacing_deck: {
		DECK_REPLACED: () => {
			return 'revealing_revealing_content'
		},
		HIDE: () => {
			return 'hiding_wiping_deck_off'
		},
	},
	revealing_revealing_content: {
		REVEALED_CONTENT_REVEALED: () => {
			return 'idle_revealed'
		},
		HIDE: () => {
			return 'hiding_wiping_deck_off'
		},
	},
}

const reducer = (state: AnimationState, event: AnimationEvent) => {
	const nextState = (
		transitionsMap[state][event.type]?.(state as never, event as never) ||
		state
	)
	console.log(state, event.type, nextState)
	return nextState
}

const cardIsVisible = matches([
	'idle_revealed',
	'idle_ssr_revealed',
	'hiding_pre_animate_scroll',
	'hiding_pre_animate_hide_content',
	'hiding_wiping_deck_off',
	'revealing_flipping_card',
	'revealing_replacing_deck',
	'revealing_revealing_content',
])

export const useAnimationState = ([loaderData, actionData]: [
	loaderData: ReturnType<typeof useRouteLoadersData>,
	actionData: ActionData | undefined,
]) => {
	const params = useParams()
	const { data: cardsSet } = useGetCardsSet(loaderData.language)
	const [state, send] = useReducer(
		reducer,
		loaderData.revealed ? 'idle_ssr_revealed' : 'idle_ssr_hidden',
	)
	// eslint-disable-next-line prefer-const
	let [[card, upsideDown], setCard] = useState(() => [
		loaderData.card || loaderData.initialCard,
		typeof loaderData.upsideDown === 'undefined'
			? loaderData.initialUpsideDown
			: loaderData.upsideDown,
	])

	if (
		!cardIsVisible(state) &&
		actionData &&
		(actionData.card !== card || actionData.upsideDown !== upsideDown)
	) {
		setCard([actionData.card, actionData.upsideDown])
	}
	const [prevLoaderCardId, setPrevLoaderCardId] = useState(
		loaderData.card?.id || loaderData.initialCard.id,
	)
	if (
		loaderData.card &&
		prevLoaderCardId !== loaderData.card?.id &&
		!cardIsVisible(state)
	) {
		setPrevLoaderCardId(loaderData.card.id)
		setCard([loaderData.card, Boolean(loaderData.upsideDown)])
	}

	if (params.id && (params.upside_down === '1' || params.upside_down === '0')) {
		const paramsUpsideDown = params.upside_down === '1'
		if (params.id !== card.id || paramsUpsideDown !== upsideDown) {
			card = cardsSet?.find(({ id }) => id === params.id) || card
			upsideDown = paramsUpsideDown
			setCard([card, upsideDown])
		}
	}

	return [state, send, card, upsideDown] as const
}
