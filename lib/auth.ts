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
  if (!username || !password) {
    return false;
  }

  // Check username
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  // For development: allow plain text password if hash not set
  if (!ADMIN_PASSWORD_HASH) {
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    return password === defaultPassword;
  }

  // Verify password with bcrypt
  try {
    return await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
  } catch (error) {
    console.error('Password verification error:', error);
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
