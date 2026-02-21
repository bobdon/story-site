import { db } from '@/lib/db'
import { stories, reactions } from '@/lib/schema'
import { desc, count, eq } from 'drizzle-orm'
import { logout } from '@/actions/auth'
import Link from 'next/link'

export default async function AdminPage() {
  const [allStories, reactionCounts] = await Promise.all([
    db
      .select({
        id: stories.id,
        title: stories.title,
        published: stories.published,
        publishedAt: stories.publishedAt,
        updatedAt: stories.updatedAt,
      })
      .from(stories)
      .orderBy(desc(stories.updatedAt)),
    db
      .select({ storyId: reactions.storyId, total: count() })
      .from(reactions)
      .groupBy(reactions.storyId),
  ])

  const reactionMap = Object.fromEntries(reactionCounts.map((r) => [r.storyId, r.total]))
  const published = allStories.filter((s) => s.published).length

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Stories</h1>
          <p className="text-sm text-zinc-400 mt-0.5">
            {published} published · {allStories.length - published} draft
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/stories/new"
            className="px-4 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            New story
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Log out
            </button>
          </form>
        </div>
      </div>

      {allStories.length === 0 ? (
        <p className="text-zinc-500">No stories yet.</p>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {allStories.map((story) => (
            <li key={story.id}>
              <Link
                href={`/admin/stories/${story.id}`}
                className="flex items-center justify-between py-4 group"
              >
                <div>
                  <span className="font-medium group-hover:underline">{story.title}</span>
                  {story.publishedAt && (
                    <span className="ml-3 text-sm text-zinc-400">
                      {story.publishedAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {(reactionMap[story.id] ?? 0) > 0 && (
                    <span className="text-sm text-zinc-400">
                      {reactionMap[story.id]} reaction{reactionMap[story.id] === 1 ? '' : 's'}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      story.published
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {story.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
