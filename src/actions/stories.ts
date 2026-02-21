'use server'
import { db } from '@/lib/db'
import { stories } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export async function createStory(formData: FormData) {
  const title = (formData.get('title') as string).trim()
  const content = formData.get('content') as string
  const published = formData.get('published') === 'on'
  const now = new Date()

  const [story] = await db
    .insert(stories)
    .values({
      title,
      slug: slugify(title),
      content,
      published,
      publishedAt: published ? now : null,
    })
    .returning({ id: stories.id })

  revalidatePath('/')
  revalidatePath('/admin')
  redirect(`/admin/stories/${story.id}`)
}

export async function updateStory(id: number, formData: FormData) {
  const title = (formData.get('title') as string).trim()
  const content = formData.get('content') as string
  const published = formData.get('published') === 'on'

  const current = await db
    .select({ published: stories.published, publishedAt: stories.publishedAt, slug: stories.slug })
    .from(stories)
    .where(eq(stories.id, id))
    .get()

  if (!current) return

  const publishedAt = published
    ? current.published && current.publishedAt
      ? current.publishedAt
      : new Date()
    : null

  await db
    .update(stories)
    .set({ title, content, published, publishedAt, updatedAt: new Date() })
    .where(eq(stories.id, id))

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath(`/stories/${current.slug}`)
}

export async function deleteStory(id: number) {
  const story = await db
    .select({ slug: stories.slug })
    .from(stories)
    .where(eq(stories.id, id))
    .get()

  await db.delete(stories).where(eq(stories.id, id))

  revalidatePath('/')
  revalidatePath('/admin')
  if (story) revalidatePath(`/stories/${story.slug}`)
  redirect('/admin')
}
