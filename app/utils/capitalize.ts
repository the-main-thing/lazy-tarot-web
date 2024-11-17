export const capitalize = (string: string): string => {
	if (string.length > 1) {

		return `${string.charAt(0).toLocaleUpperCase()}${string.slice(1)}`
	}
	return string.charAt(0)?.toLocaleUpperCase() || string
}
