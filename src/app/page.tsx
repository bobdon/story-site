import { db } from "@/lib/db";
import { stories } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import Link from "next/link";
import { getExcerpt } from "@/lib/utils";

export default async function Home() {
  const posts = await db
    .select({
      id: stories.id,
      title: stories.title,
      slug: stories.slug,
      content: stories.content,
      publishedAt: stories.publishedAt,
    })
    .from(stories)
    .where(eq(stories.published, true))
    .orderBy(desc(stories.publishedAt));

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-12">Stories</h1>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No stories published yet.</p>
      ) : (
        <ul className="space-y-10">
          {posts.map((post) => (
            <li key={post.id}>
              <Link href={`/stories/${post.slug}`} className="group block">
                <h2 className="text-lg font-medium group-hover:underline mb-1">
                  {post.title}
                </h2>
                {post.publishedAt && (
                  <time className="text-sm text-zinc-400">
                    {post.publishedAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                )}
                <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
                  {getExcerpt(post.content)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
