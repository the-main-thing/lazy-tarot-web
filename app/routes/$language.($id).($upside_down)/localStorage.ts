import { LOCAL_STORAGE_KEYS } from '~/constants'

function maybeSync<TCallback extends () => any>(callback: TCallback): [ReturnType<TCallback>, null] | [null, Error] {
	try {
		return [callback(), null]
	} catch (error) {
		return [null, error as Error]
	}

}

export const setPrevPickedCards = (
	cards: Array<{ id: string; upsideDown: boolean }>,
) => {
	const [_, error] = maybeSync(() => {
		window.localStorage.setItem(
			LOCAL_STORAGE_KEYS.TAROT_READING_SINGLE_HISTORY,
			JSON.stringify(cards),
		)
	})
	if (error) {
		maybeSync(() => {
			window.localStorage.setItem(
				LOCAL_STORAGE_KEYS.TAROT_READING_SINGLE_HISTORY,
				'[]',
			)
		})
	}
}

export const getPrevPickedCards = () => {
	let [prevPickedCards] = maybeSync(() => {
		const storedCards = JSON.parse(
			window.localStorage.getItem(
				LOCAL_STORAGE_KEYS.TAROT_READING_SINGLE_HISTORY,
			) as string,
		)
		if (
			Array.isArray(storedCards) &&
			storedCards.every((card) => {
				return (
					card &&
					typeof card === 'object' &&
					'id' in card &&
					card.id &&
					typeof card.id === 'string' &&
					'upsideDown' in card &&
					typeof card.upsideDown === 'boolean'
				)
			})
		) {
			return storedCards as Array<{ id: string; upsideDown: boolean }>
		}
		throw new Error('Invalid stored cards')
	})

	if (!prevPickedCards) {
		prevPickedCards = []
		setPrevPickedCards(prevPickedCards)
	}

	return prevPickedCards
}
