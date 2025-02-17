import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (path.startsWith('/admin')) {
      if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MANAGER'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/login?callbackUrl=' + encodeURIComponent(req.url), req.url))
      }

      if (path.startsWith('/admin/users') && !['SUPER_ADMIN', 'ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      if (path.startsWith('/admin/articles') && !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      if (path.startsWith('/admin/advertisements') && !['SUPER_ADMIN', 'ADMIN'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }

      if (path.startsWith('/admin/approvals') && !['SUPER_ADMIN', 'ADMIN', 'MANAGER'].includes(token.role as string)) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
  }
)

export const config = {
  matcher: ['/admin/:path*']
}

