import { config } from 'dotenv'
config({ path: '.env.local' })
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../src/lib/schema'

const sqlite = new Database(process.env.DATABASE_URL!)
const db = drizzle({ client: sqlite, schema })

const seedStories = [
  {
    title: 'The Last Train Home',
    slug: 'the-last-train-home',
    content: `It was 11:47 PM when she realized the last train had already left. The board above the empty platform still flickered with its departure time — 11:45 — as if taunting her. She stood there with her suitcase and her coat and the particular exhaustion of someone who had been traveling for sixteen hours and still had nowhere to sleep.

The station was nearly empty. A janitor pushed a wide mop across the marble floor, not looking up. A man in a suit sat on a bench with his briefcase between his feet, staring at his phone with the focused blankness of someone who had given up on his evening.

She found a payphone out of habit, then remembered she didn't have coins. She found her cell phone and called her sister, who didn't answer. She called her friend Marcus, who answered on the fourth ring, groggy and confused, and agreed to come get her in forty minutes, maybe forty-five.

She sat on the bench across from the man with the briefcase. Neither of them spoke. The janitor's mop made a slow rhythmic sound across the floor. Outside, it had started to rain.

By the time Marcus arrived — it was nearly one in the morning — she had eaten a candy bar from the vending machine, read half a magazine someone had left on the bench, and decided, quietly and without drama, that she was going to move back home. Not because the city had been unkind. It hadn't, particularly. But because there was a moment when you realized that the life you were building was not the one you had meant to build, and that the time to say so was before you built any more of it.

Marcus pulled up to the curb and rolled down the window and said, "You look terrible."

"I know," she said, and put her suitcase in the back.`,
    published: true,
    publishedAt: new Date('2025-11-10'),
  },
  {
    title: 'A Sunday in November',
    slug: 'a-sunday-in-november',
    content: `The leaves had all fallen by then, and the yard looked like a different place entirely. My father was raking them into piles along the fence line, the way he always did, slowly and without complaint, as if raking leaves were a form of prayer.

I watched him from the kitchen window while the coffee brewed. He was seventy-one now. His movements were still deliberate, still careful, but there was something in the way he stopped to rest on the rake handle — just for a moment, just to look up at the gray sky — that I hadn't noticed before.

I brought him a cup and we stood together at the edge of the yard. The air smelled like cold dirt and something burning somewhere far off.

"You don't have to do all of this today," I said.

"I know," he said, and kept looking at the sky.

We didn't talk much after that. I held my coffee with both hands and he went back to raking and the leaves made their soft sounds as they gathered. The neighbor's dog barked twice and then went quiet. A car passed on the road at the end of the driveway.

I thought about all the Sundays I had stood in this yard, at every age, and how the yard had always looked more or less the same even as everything else changed. The old oak tree. The rusted gate my father kept meaning to fix. The flower bed my mother had planted thirty years ago that still came up every spring as if she had asked it to.

He finished the last pile and stood looking at his work. Then he looked at me.

"Same time next year," he said, which was what he always said.

"Same time next year," I said back.`,
    published: true,
    publishedAt: new Date('2025-12-01'),
  },
  {
    title: 'What the River Knows',
    slug: 'what-the-river-knows',
    content: `Every town has a river, and every river has its secrets. Ours was the Kellner, a slow brown thing that ran along the eastern edge of town between the old mill and the park where nobody went anymore. It flooded every few years and when it did it left a smell that lasted for weeks — mud and rot and something older than both.

I grew up believing the river was alive in some way that the adults in my life were careful not to confirm or deny. My grandmother, who had grown up on its banks before the mill was built, would sometimes look at it for a long time without speaking. When I asked her what she was thinking she would say, "Nothing," in the particular way that meant something.

The summer I was twelve, two boys from my school found something caught in the reeds near the old bridge. I never saw it myself — by the time I heard about it the police had already come and gone and the boys were being talked about in the careful way that meant they had seen something they shouldn't have. One of them moved away before school started. The other one stayed but became quiet in a way he hadn't been before.

I asked my grandmother about it that fall. We were sitting on her porch watching the light go out of the sky.

"The river gives things back," she said, "when it's ready."

I didn't know what that meant. I still don't, not exactly. But I have lived in four cities since then and I have never lived near a river, and I think that is not entirely a coincidence.`,
    published: true,
    publishedAt: new Date('2026-01-15'),
  },
  {
    title: 'Draft: Something New',
    slug: 'draft-something-new',
    content: 'Work in progress...',
    published: false,
    publishedAt: null,
  },
]

async function main() {
  await db.delete(schema.stories)
  await db.insert(schema.stories).values(seedStories)
  console.log(`Seeded ${seedStories.length} stories (${seedStories.filter(s => s.published).length} published, 1 draft)`)
  sqlite.close()
}

main()
