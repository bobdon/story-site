import { db } from '@/lib/db'
import { stories } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { updateStory, deleteStory } from '@/actions/stories'
import StoryEditor from '@/components/StoryEditor'
import Link from 'next/link'

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const story = await db
    .select()
    .from(stories)
    .where(eq(stories.id, parseInt(id)))
    .get()

  if (!story) notFound()

  const updateAction = updateStory.bind(null, story.id)
  const deleteAction = deleteStory.bind(null, story.id)

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 inline-block">
        ← Admin
      </Link>
      <StoryEditor story={story} action={updateAction} deleteAction={deleteAction} />
    </main>
  )
}
