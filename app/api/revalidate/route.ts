import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    requireAuth();

    const body = await request.json();
    const { path } = body;

    if (!path || typeof path !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Path is required' },
        { status: 400 }
      );
    }

    // Revalidate the specified path
    revalidatePath(path);

    return NextResponse.json({
      success: true,
      message: `Revalidated ${path}`,
    });
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.error('Revalidate error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
