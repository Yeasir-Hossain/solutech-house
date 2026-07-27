import { NextResponse, type NextRequest } from 'next/server';
import { SESSION_COOKIE, verifySession } from '@/lib/auth';

/**
 * Gate for the submissions area.
 *
 * Middleware is the only place that sees every /admin request, including
 * prefetches and API calls, so the check lives here rather than in each page.
 * The pages verify the session again before reading data — middleware is the
 * front door, not the only lock.
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isLogin = pathname.startsWith('/admin/login');
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await verifySession(token);

  if (isLogin) {
    if (user) {
      return NextResponse.redirect(new URL('/admin/', req.url));
    }
    return NextResponse.next();
  }

  if (!user) {
    const login = new URL('/admin/login/', req.url);
    // Send the visitor back where they were aiming once they authenticate.
    if (pathname !== '/admin/' && pathname !== '/admin') {
      login.searchParams.set('next', `${pathname}${search}`);
    }
    const res = NextResponse.redirect(login);
    res.headers.set('Cache-Control', 'no-store');
    return res;
  }

  const res = NextResponse.next();
  res.headers.set('Cache-Control', 'no-store');
  res.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
