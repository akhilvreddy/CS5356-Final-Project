//@ts-ignore  -- drizzle-kit ships no type defs
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' }) 
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})