'use client'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

type Story = {
  id: number
  title: string
  slug: string
  content: string
  published: boolean
}

type Props = {
  story?: Story
  action: (formData: FormData) => Promise<void>
  deleteAction?: (formData: FormData) => Promise<void>
}

export default function StoryEditor({ story, action, deleteAction }: Props) {
  const [title, setTitle] = useState(story?.title ?? '')
  const [content, setContent] = useState(story?.content ?? '')
  const [published, setPublished] = useState(story?.published ?? false)
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-6">
        {/* Title */}
        <div>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full text-2xl font-semibold outline-none border-b border-zinc-200 dark:border-zinc-700 pb-2 bg-transparent focus:border-zinc-400 dark:focus:border-zinc-500 placeholder:text-zinc-300 dark:placeholder:text-zinc-600"
            required
          />
          {story && (
            <p className="text-xs text-zinc-400 mt-1.5">/stories/{story.slug}</p>
          )}
        </div>

        {/* Editor */}
        <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden">
          <div className="flex border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setTab('write')}
              className={`px-4 py-2 text-sm transition-colors ${
                tab === 'write'
                  ? 'bg-white dark:bg-black font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setTab('preview')}
              className={`px-4 py-2 text-sm transition-colors ${
                tab === 'preview'
                  ? 'bg-white dark:bg-black font-medium'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Preview
            </button>
          </div>

          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your story in Markdown..."
            className={`w-full min-h-[520px] p-4 font-mono text-sm outline-none resize-y bg-white dark:bg-black leading-relaxed ${
              tab === 'preview' ? 'hidden' : ''
            }`}
          />

          {tab === 'preview' && (
            <div className="min-h-[520px] p-6 leading-8 text-zinc-800 dark:text-zinc-200 [&>*+*]:mt-5">
              {content ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                <p className="text-zinc-400 italic">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              name="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            Published
          </label>

          <button
            type="submit"
            className="px-5 py-2 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            Save
          </button>
        </div>
      </form>

      {deleteAction && (
        <form
          action={deleteAction}
          onSubmit={(e) => {
            if (!confirm('Delete this story? This cannot be undone.')) e.preventDefault()
          }}
        >
          <button
            type="submit"
            className="text-sm text-red-500 hover:text-red-700 transition-colors"
          >
            Delete story
          </button>
        </form>
      )}
    </div>
  )
}
