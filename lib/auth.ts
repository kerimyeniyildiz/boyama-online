import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '';

interface JWTPayload {
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * Validate user credentials with bcrypt
 */
export async function validateCredentials(username: string, password: string): Promise<boolean> {
  console.log('[AUTH] validateCredentials called');
  console.log('[AUTH] Expected username:', ADMIN_USERNAME);
  console.log('[AUTH] Received username:', username);
  console.log('[AUTH] Password hash exists:', !!ADMIN_PASSWORD_HASH);
  console.log('[AUTH] JWT_SECRET exists:', !!JWT_SECRET);

  if (!username || !password) {
    console.log('[AUTH] Missing username or password');
    return false;
  }

  // Check username
  if (username !== ADMIN_USERNAME) {
    console.log('[AUTH] Username mismatch');
    return false;
  }

  // For development: allow plain text password if hash not set
  if (!ADMIN_PASSWORD_HASH) {
    console.log('[AUTH] No password hash set, using plain text comparison');
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    console.log('[AUTH] Default password:', defaultPassword);
    const result = password === defaultPassword;
    console.log('[AUTH] Plain text comparison result:', result);
    return result;
  }

  // Verify password with bcrypt
  try {
    console.log('[AUTH] Verifying password with bcrypt...');
    console.log('[AUTH] Hash to compare against:', ADMIN_PASSWORD_HASH.substring(0, 20) + '...');
    const result = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    console.log('[AUTH] Bcrypt comparison result:', result);
    return result;
  } catch (error) {
    console.error('[AUTH] Password verification error:', error);
    return false;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(username: string): string {
  return jwt.sign(
    {
      username,
      role: 'admin',
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  try {
    const sessionCookie = cookies().get('admin-session');

    if (!sessionCookie?.value) {
      return false;
    }

    // Verify JWT token
    const payload = verifyToken(sessionCookie.value);

    if (!payload) {
      return false;
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return false;
    }

    return payload.username === ADMIN_USERNAME;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

/**
 * Require authentication (throws error if not authenticated)
 */
export function requireAuth() {
  if (!isAuthenticated()) {
    throw new Error('Unauthorized');
  }
}

/**
 * Hash password (for setup/testing)
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}
