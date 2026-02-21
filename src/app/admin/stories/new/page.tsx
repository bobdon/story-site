import { createStory } from '@/actions/stories'
import StoryEditor from '@/components/StoryEditor'
import Link from 'next/link'

export default function NewStoryPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 inline-block">
        ← Admin
      </Link>
      <StoryEditor action={createStory} />
    </main>
  )
}
