import { z } from 'zod'

export const env = z.object({
	API_ENDPOINT: z.string(),
	LAZY_TAROT_API_KEY: z.string(),
	DB_FILE_NAME: z.string()
}).parse(process.env)

