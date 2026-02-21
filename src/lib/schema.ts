// src/lib/schema.ts
import { int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export const stories = sqliteTable('stories', {
  id: int().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  slug: text().notNull().unique(),
  content: text().notNull().default(''),
  published: int({ mode: 'boolean' }).notNull().default(false),
  publishedAt: int({ mode: 'timestamp' }),
  createdAt: int({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: int({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
})

export const REACTION_TYPES = ['heart', 'clap', 'wow', 'fire'] as const
export type ReactionType = typeof REACTION_TYPES[number]

export const reactions = sqliteTable('reactions', {
  id: int().primaryKey({ autoIncrement: true }),
  storyId: int().notNull().references(() => stories.id, { onDelete: 'cascade' }),
  fingerprint: text().notNull(),
  type: text().$type<ReactionType>().notNull(),
  createdAt: int({ mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
}, (table) => ({
  uniqueReaction: unique().on(table.storyId, table.fingerprint, table.type),
}))
