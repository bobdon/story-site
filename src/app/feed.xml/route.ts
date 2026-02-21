import { db } from '@/lib/db'
import { stories } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { getExcerpt } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function GET() {
  const posts = await db
    .select()
    .from(stories)
    .where(eq(stories.published, true))
    .orderBy(desc(stories.publishedAt))

  const items = posts
    .map((post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/stories/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/stories/${post.slug}</guid>
      <description>${escapeXml(getExcerpt(post.content))}</description>
      ${post.publishedAt ? `<pubDate>${post.publishedAt.toUTCString()}</pubDate>` : ''}
    </item>`)
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Stories</title>
    <link>${SITE_URL}</link>
    <description>A collection of stories</description>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600',
    },
  })
}
