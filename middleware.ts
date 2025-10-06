import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function middleware(request: NextRequest) {
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

  // Admin authentication check for dashboard routes
  if (request.nextUrl.pathname.startsWith('/admin/dashboard')) {
    console.log('[MIDDLEWARE] Checking auth for:', request.nextUrl.pathname);
    const adminSession = request.cookies.get('admin-session');
    console.log('[MIDDLEWARE] Cookie exists:', !!adminSession);
    console.log('[MIDDLEWARE] Cookie value preview:', adminSession?.value?.substring(0, 30) + '...');

    if (!adminSession) {
      console.log('[MIDDLEWARE] No cookie found, redirecting to /admin');
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    try {
      // Verify JWT token in Edge runtime
      console.log('[MIDDLEWARE] Verifying JWT token...');
      const secret = new TextEncoder().encode(JWT_SECRET);
      const verified = await jwtVerify(adminSession.value, secret);
      console.log('[MIDDLEWARE] JWT verified successfully, user:', verified.payload);
      // Token is valid, allow access
    } catch (error) {
      // Token is invalid or expired, redirect to login
      console.error('[MIDDLEWARE] JWT verification failed:', error);
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
