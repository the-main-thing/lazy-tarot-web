import { defineConfig } from 'drizzle-kit';
import { env } from './app/utils/env.server'

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema/index.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
