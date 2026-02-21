'use client'
import { useOptimistic, useTransition } from 'react'
import { toggleReaction } from '@/actions/reactions'
import type { ReactionType } from '@/lib/schema'

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'heart', emoji: '❤️', label: 'Love' },
  { type: 'clap',  emoji: '👏', label: 'Applause' },
  { type: 'wow',   emoji: '😮', label: 'Wow' },
  { type: 'fire',  emoji: '🔥', label: 'Fire' },
]

type Props = {
  storyId: number
  counts: Record<string, number>
  userReactions: string[]
}

export default function Reactions({ storyId, counts, userReactions }: Props) {
  const [optimistic, setOptimistic] = useOptimistic(
    { counts, userReactions },
    (state, { type, wasActive }: { type: string; wasActive: boolean }) => ({
      counts: {
        ...state.counts,
        [type]: (state.counts[type] ?? 0) + (wasActive ? -1 : 1),
      },
      userReactions: wasActive
        ? state.userReactions.filter((r) => r !== type)
        : [...state.userReactions, type],
    }),
  )

  const [, startTransition] = useTransition()

  function handleClick(type: ReactionType) {
    const wasActive = optimistic.userReactions.includes(type)
    startTransition(async () => {
      setOptimistic({ type, wasActive })
      await toggleReaction(storyId, type)
    })
  }

  return (
    <div className="flex gap-2 mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800">
      {REACTIONS.map(({ type, emoji, label }) => {
        const active = optimistic.userReactions.includes(type)
        const count = optimistic.counts[type] ?? 0
        return (
          <button
            key={type}
            onClick={() => handleClick(type)}
            aria-label={label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-all ${
              active
                ? 'bg-zinc-100 border-zinc-400 dark:bg-zinc-800 dark:border-zinc-500'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500'
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && (
              <span className="text-zinc-500 dark:text-zinc-400 tabular-nums">{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
