import { db } from "@/lib/db";
import { stories, reactions } from "@/lib/schema";
import { eq, and, count } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Reactions from "@/components/Reactions";
import { headers } from "next/headers";
import { createHash } from "crypto";

async function getFingerprint() {
  const h = await headers();
  const ip = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "unknown";
  const ua = h.get("user-agent") ?? "";
  return createHash("sha256")
    .update(`${ip}:${ua}:${process.env.SESSION_SECRET}`)
    .digest("hex");
}

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

  const fingerprint = await getFingerprint();

  const [reactionCounts, userReactionRows] = await Promise.all([
    db
      .select({ type: reactions.type, count: count() })
      .from(reactions)
      .where(eq(reactions.storyId, story.id))
      .groupBy(reactions.type),
    db
      .select({ type: reactions.type })
      .from(reactions)
      .where(and(eq(reactions.storyId, story.id), eq(reactions.fingerprint, fingerprint))),
  ]);

  const counts = Object.fromEntries(reactionCounts.map((r) => [r.type, r.count]));
  const userReactions = userReactionRows.map((r) => r.type);

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

        <Reactions storyId={story.id} counts={counts} userReactions={userReactions} />
      </article>
    </main>
  );
}
