const LIST_SIZE = 90 * 3
const GENERATE_AT = Math.max(Math.floor(LIST_SIZE / 3) - 1, 1)

const requestIdleCallback = (callback: () => void) => {
	try {
		if (typeof window.requestIdleCallback !== 'undefined') {
			const id = window.requestIdleCallback(callback)
			return () => {
				window.cancelIdleCallback(id)
			}
		}
		const id = window.setTimeout(callback)
		return () => {
			window.clearTimeout(id)
		}

	} catch {
		if (typeof window === 'undefined') {
			callback()
			return () => void 0
		}
		const id = window.setTimeout(callback)
		return () => {
			window.clearTimeout(id)
		}
	}
}

const getRandomValuesGenerator = () => {
	const randomValues = [] as Array<number>
	let generating = false

	const generate = () => {
		if (generating) {
			return
		}
		generating = true
		return requestIdleCallback(() => {
			for (let i = randomValues.length; i < 90 * 3; i++) {
				randomValues.push(Math.random())
			}
			generating = false
		})
	}

	generate()
	const rand = () => {
		if (randomValues.length === 0) {
			generate()
			return Math.random()
		}
		if (randomValues.length <= GENERATE_AT) {
			generate()
		}
		return randomValues.pop() as number
	}
	return rand
}



export const rand = getRandomValuesGenerator()
