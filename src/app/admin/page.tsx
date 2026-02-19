// src/app/admin/page.tsx
import { logout } from '@/actions/auth'

export default function AdminPage() {
  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-gray-600 hover:text-black underline"
          >
            Log out
          </button>
        </form>
      </div>
      <p className="text-gray-500">Stories will appear here in Phase 2.</p>
    </main>
  )
}
