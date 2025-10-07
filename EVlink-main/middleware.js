import { NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// This function can be marked `async` if using `await` inside
export async function middleware(request) {
  const response = NextResponse.next()
  
  // Initialize Supabase client with environment variables
  const supabase = createMiddlewareClient(
    { req: request, res: response },
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }
  )

  // Get the current session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Define protected and auth routes
  const protectedRoutes = ['/dashboard', '/profile', '/evownerdashboard', '/chargerownerdashboard']
  const authRoutes = ['/', '/signup', '/register', '/chargingflow']
  
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  const isAuthRoute = authRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )
  
  // Allow a brief grace period right after login to avoid redirect loop before session hydrates
  const justLoggedIn = request.cookies.get('justLoggedIn')?.value === '1'
  // Redirect to home (auth page) if trying to access protected route without session
  if (isProtectedRoute && !session && !justLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Do not force redirect when logged in; allow deep-links to dashboards
  
  return response
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
    '/((?!api|_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
