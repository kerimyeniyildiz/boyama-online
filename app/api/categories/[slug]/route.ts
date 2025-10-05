import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug, updateCategory, deleteCategory, normalizeSlug } from '@/lib/fileSystem';
import { requireAuth } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: { slug: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const category = await getCategoryBySlug(params.slug);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch category',
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    requireAuth();

    const body = await request.json();
    const { title, description, metaDescription, keywords, featured } = body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title is required',
        },
        { status: 400 }
      );
    }

    const normalizedSlug = normalizeSlug(params.slug);
    const updatedCategory = await updateCategory(normalizedSlug, {
      title: title.trim(),
      description: description?.trim() || '',
      metaDescription: metaDescription?.trim() || '',
      keywords: Array.isArray(keywords)
        ? keywords.map((keyword: string) => keyword.trim()).filter(Boolean)
        : undefined,
      featured: typeof featured === 'boolean' ? featured : undefined,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to update category',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully',
    });
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    console.error('Error updating category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update category',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    requireAuth();

    const normalizedSlug = normalizeSlug(params.slug);
    const category = await getCategoryBySlug(normalizedSlug);

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 404 }
      );
    }

    const success = await deleteCategory(normalizedSlug);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to delete category',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    if (error?.message === 'Unauthorized') {
      return NextResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    console.error('Error deleting category:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete category',
      },
      { status: 500 }
    );
  }
}
