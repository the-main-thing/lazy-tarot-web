import { db } from './db/db'
import { cache } from './db/schema'
import { eq } from 'drizzle-orm'

const STALE_TIME = 1000 * 60 * 60 * 1 // 1 hour

export async function getItem(key: string, staleTime = STALE_TIME) {
	try {
		const data = await db.select().from(cache).where(eq(cache.key, key)).limit(1)
		if (!data.length) {
			return null
		}
		const { updatedAt } = data[0]
		if (updatedAt + staleTime > Date.now()) {
			return data[0].value
		}
		await removeItem(key)
		return null
	} catch (error) {
		console.error(new Date(), 'Cannot getItem from cache\n', error)
		return null
	}
}

export async function setItem(key: string, value: string) {
	try {
		await db.insert(cache).values({
			key,
			value,
			updatedAt: Date.now(),
		}).onConflictDoUpdate({
			target: cache.key,
			set: { value, updatedAt: Date.now() }
		})
	} catch (error) {
		console.error(new Date(), 'Cannot setItem to cache\n', error)
		return
	}
}
export async function removeItem(key: string) {
	try {
		await db.delete(cache).where(eq(cache.key, key))
	} catch (error) {
		console.error(new Date(), 'Cannot removeItem from cache\n', error)
		return
	}
}

