import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase'

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/create-post',
  '/community',
  '/admin'
]

// Public routes that should redirect authenticated users
const authRoutes = [
  '/auth',
  '/auth/callback'
]

// Routes that don't need protection
const publicRoutes = [
  '/',
  '/about',
  '/help'
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create Supabase client for server-side auth check
  const response = NextResponse.next()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables in middleware')
    return response
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  try {
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()

    // Check if the current route is protected
    const isProtectedRoute = protectedRoutes.some(route =>
      pathname.startsWith(route)
    )

    // Check if the current route is an auth route
    const isAuthRoute = authRoutes.some(route =>
      pathname.startsWith(route)
    )

    // Check if the current route is public
    const isPublicRoute = publicRoutes.some(route =>
      pathname === route || pathname.startsWith(route + '/')
    )

    // If user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/auth', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If user is authenticated and trying to access auth routes
    if (isAuthRoute && session) {
      const redirectTo = request.nextUrl.searchParams.get('redirect') || '/'
      return NextResponse.redirect(new URL(redirectTo, request.url))
    }

    // If user is authenticated and accessing root, redirect to dashboard
    if (pathname === '/' && session) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response

  } catch (error) {
    console.error('Middleware error:', error)

    // On error, redirect to auth for protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
