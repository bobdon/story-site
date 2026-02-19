// src/app/login/page.tsx
'use client'
import { useActionState } from 'react'
import { login } from '@/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null)

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-semibold mb-6">Sign in</h1>
        <form action={formAction} className="flex flex-col gap-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          {state?.error && (
            <p className="text-red-600 text-sm">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
          >
            {isPending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
