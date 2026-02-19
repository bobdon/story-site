// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'
import { cookies } from 'next/headers'

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isAdminRoute = path.startsWith('/admin')
  const isLoginPage = path === '/login'

  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (isAdminRoute && !session?.isAdmin) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (isLoginPage && session?.isAdmin) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
