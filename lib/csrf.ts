import { cookies } from 'next/headers';
import crypto from 'crypto';

const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-secret-change-in-production';

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Set CSRF token in cookie
 */
export function setCsrfToken(): string {
  const token = generateCsrfToken();

  cookies().set({
    name: CSRF_TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
    path: '/',
  });

  return token;
}

/**
 * Verify CSRF token
 */
export function verifyCsrfToken(token: string): boolean {
  try {
    const cookieToken = cookies().get(CSRF_TOKEN_NAME)?.value;

    if (!cookieToken || !token) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(token)
    );
  } catch (error) {
    console.error('CSRF verification error:', error);
    return false;
  }
}

/**
 * Get CSRF token from cookie
 */
export function getCsrfToken(): string | undefined {
  return cookies().get(CSRF_TOKEN_NAME)?.value;
}
