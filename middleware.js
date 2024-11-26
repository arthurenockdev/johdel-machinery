import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession();

  // Forward to login for protected routes if no session
  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                    req.nextUrl.pathname.startsWith('/register');
  const isApiRoute = req.nextUrl.pathname.startsWith('/api');
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');

  if (!session && !isAuthPage && !isApiRoute) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to home if logged in user tries to access auth pages
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Check admin access
  if (isAdminRoute && (!session || session.user.user_metadata.role !== 'admin')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
