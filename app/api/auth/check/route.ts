import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

// Mark as dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log('[AUTH-CHECK] Request received');
    const cookies = request.cookies.getAll();
    console.log('[AUTH-CHECK] All cookies:', cookies.map(c => ({ name: c.name, value: c.value.substring(0, 20) + '...' })));

    const authenticated = isAuthenticated();
    console.log('[AUTH-CHECK] Authentication result:', authenticated);

    return NextResponse.json({
      success: true,
      authenticated,
    });
  } catch (error) {
    console.error('[AUTH-CHECK] Error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
    });
  }
}
