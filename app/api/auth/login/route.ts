import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials, generateToken } from '@/lib/auth';

export const runtime = 'nodejs';

// Rate limiting storage (in production, use Redis)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes

function getRateLimitKey(ip: string): string {
  return `login:${ip}`;
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const record = loginAttempts.get(key);

  // Reset if window expired
  if (record && now > record.resetTime) {
    loginAttempts.delete(key);
  }

  const current = loginAttempts.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (current.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - current.count };
}

function recordLoginAttempt(ip: string) {
  const key = getRateLimitKey(ip);
  const now = Date.now();
  const current = loginAttempts.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  loginAttempts.set(key, {
    count: current.count + 1,
    resetTime: current.resetTime,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many login attempts. Please try again in 15 minutes.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.floor((loginAttempts.get(getRateLimitKey(ip))?.resetTime || 0) / 1000)),
          }
        }
      );
    }

    // Parse request body
    let username = '';
    let password = '';

    try {
      const body = await request.json();
      username = body?.username || '';
      password = body?.password || '';
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
        },
        { status: 400 }
      );
    }

    // Validate input
    if (!username || !password) {
      recordLoginAttempt(ip);
      return NextResponse.json(
        {
          success: false,
          error: 'Username and password are required',
        },
        { status: 400 }
      );
    }

    // Validate credentials
    const isValid = await validateCredentials(username, password);

    if (!isValid) {
      recordLoginAttempt(ip);

      // Generic error message to prevent user enumeration
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
        },
        {
          status: 401,
          headers: {
            'X-RateLimit-Remaining': String(rateLimit.remaining - 1),
          }
        }
      );
    }

    // Generate JWT token
    const token = generateToken(username);

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Build cookie string
    // Note: Secure flag should be enabled when using HTTPS in production
    const cookieParts = [
      `admin-session=${token}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      `Max-Age=${24 * 60 * 60}`,
    ];

    const cookieString = cookieParts.join('; ');
    response.headers.append('Set-Cookie', cookieString);

    // Clear rate limit on successful login
    loginAttempts.delete(getRateLimitKey(ip));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
