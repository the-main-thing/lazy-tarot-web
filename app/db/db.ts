import { env } from "~/utils/env.server";
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle(env.DB_FILE_NAME);
