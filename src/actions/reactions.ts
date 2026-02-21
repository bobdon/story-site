'use server'
import { db } from '@/lib/db'
import { reactions, stories, REACTION_TYPES, type ReactionType } from '@/lib/schema'
import { and, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { createHash } from 'crypto'
import { revalidatePath } from 'next/cache'

async function getFingerprint() {
  const h = await headers()
  const ip = h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? 'unknown'
  const ua = h.get('user-agent') ?? ''
  return createHash('sha256')
    .update(`${ip}:${ua}:${process.env.SESSION_SECRET}`)
    .digest('hex')
}

export async function toggleReaction(storyId: number, type: ReactionType) {
  if (!REACTION_TYPES.includes(type)) return

  const fingerprint = await getFingerprint()

  const existing = await db
    .select({ id: reactions.id })
    .from(reactions)
    .where(and(
      eq(reactions.storyId, storyId),
      eq(reactions.fingerprint, fingerprint),
      eq(reactions.type, type),
    ))
    .get()

  if (existing) {
    await db.delete(reactions).where(eq(reactions.id, existing.id))
  } else {
    await db.insert(reactions).values({ storyId, fingerprint, type })
  }

  const story = await db
    .select({ slug: stories.slug })
    .from(stories)
    .where(eq(stories.id, storyId))
    .get()

  if (story) revalidatePath(`/stories/${story.slug}`)
}
