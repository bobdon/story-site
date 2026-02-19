// src/actions/auth.ts
'use server'
import bcrypt from 'bcrypt'
import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'

export async function login(_prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get('password') as string

  if (!password) {
    return { error: 'Password is required' }
  }

  const isValid = await bcrypt.compare(
    password,
    process.env.ADMIN_PASSWORD_HASH!
  )

  if (!isValid) {
    return { error: 'Incorrect password' }
  }

  await createSession()
  redirect('/admin')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
