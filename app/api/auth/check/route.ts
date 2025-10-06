import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';

// Mark as dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const authenticated = isAuthenticated();

    return NextResponse.json({
      success: true,
      authenticated,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
    });
  }
}
