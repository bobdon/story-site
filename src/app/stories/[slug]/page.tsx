import { db } from "@/lib/db";
import { stories } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default async function StoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const story = await db
    .select()
    .from(stories)
    .where(and(eq(stories.slug, slug), eq(stories.published, true)))
    .get();

  if (!story) notFound();

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-10 inline-block"
      >
        ← All stories
      </Link>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight mb-3">
            {story.title}
          </h1>
          {story.publishedAt && (
            <time className="text-sm text-zinc-500">
              {story.publishedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
        </header>

        <div className="leading-8 text-zinc-800 dark:text-zinc-200 [&>*+*]:mt-5">
          <ReactMarkdown>{story.content}</ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
