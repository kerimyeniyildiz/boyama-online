import { NextRequest, NextResponse } from 'next/server';

// Edge runtime doesn't support Node's Buffer. Declare atob for decoding.
// eslint-disable-next-line no-var
declare var atob: (s: string) => string;

export function middleware(request: NextRequest) {
  // CSRF protection for state-changing methods
  const isStateMutatingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');

  if (isStateMutatingMethod && isApiRoute && !request.nextUrl.pathname.startsWith('/api/auth/login')) {
    const csrfToken = request.headers.get('x-csrf-token');
    const csrfCookie = request.cookies.get('csrf-token')?.value;

    // Skip CSRF check for file uploads (handled separately with auth)
    const isUploadRoute = request.nextUrl.pathname === '/api/upload';

    if (!isUploadRoute && (!csrfToken || !csrfCookie || csrfToken !== csrfCookie)) {
      return NextResponse.json(
        { success: false, error: 'Invalid CSRF token' },
        { status: 403 }
      );
    }
  }

  // Admin authentication check
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (request.nextUrl.pathname === '/admin') {
      return NextResponse.next();
    }

    const adminSession = request.cookies.get('admin-session');

    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      const decoded = typeof atob === 'function' ? atob(adminSession.value) : '';
      const [username, timestamp] = (decoded || '').split(':');

      const sessionTime = parseInt(timestamp);
      const currentTime = Date.now();
      const maxAge = 24 * 60 * 60 * 1000;

      if (!sessionTime || currentTime - sessionTime > maxAge) {
        const response = NextResponse.redirect(new URL('/admin', request.url));
        response.cookies.delete('admin-session');
        return response;
      }
    } catch (error) {
      const response = NextResponse.redirect(new URL('/admin', request.url));
      response.cookies.delete('admin-session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.webp$).*)',
  ],
}
