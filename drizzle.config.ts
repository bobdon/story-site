// drizzle.config.ts
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

// Load .env.local for local development (Next.js convention)
config({ path: '.env.local' })

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
