import { useQuery } from '@tanstack/react-query'
import type { LoaderData } from './route'


export const getKey = (language: string) => ['cardsSet', language] as const

export const queryCardsSet = async (language: string, ts?: number) => {
	const url = new URL(
		`/api/${language}/get-full-tarot-set/${__BUILD_TIMESTAMP__}`,
		window.location.origin,
	)
	if (ts) {
		url.searchParams.set('ts', String(ts))
	}
	const response = await fetch(url)

	if (response.status >= 400) {
		const body = await response.text()
		throw new Error(body)
	}

	return (await response.json()) as LoaderData
}

export const useGetCardsSet = (language: string) => {
	return useQuery({
		queryKey: getKey(language),
		queryFn: () => queryCardsSet(language),
		staleTime: Infinity,
		gcTime: Infinity,
	})
}
