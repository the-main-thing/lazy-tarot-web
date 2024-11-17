import { env } from "~/utils/env.server";
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema'

export const db = drizzle(env.DB_FILE_NAME, { schema });
