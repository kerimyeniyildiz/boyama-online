import { NextRequest, NextResponse } from 'next/server';
import { addCategory, getCategoriesWithImages, normalizeSlug, syncCategoriesWithFileSystem } from '@/lib/fileSystem';
import { requireAuth } from '@/lib/auth';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function buildSlugFromTitle(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return normalizeSlug(base || 'untitled');
}

export async function GET() {
  try {
    syncCategoriesWithFileSystem();
    const categories = await getCategoriesWithImages();

    return NextResponse.json({
      success: true,
      data: categories,
      count: categories.length,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const trimmedTitle = title.trim();
    const slug = buildSlugFromTitle(trimmedTitle);

    addCategory({
      slug,
      title: trimmedTitle,
      description: description?.trim() || `Beautiful ${trimmedTitle} coloring pages for kids.`,
      metaDescription: metaDescription?.trim() || `Free printable ${trimmedTitle} coloring pages for children.`,
      keywords:
        Array.isArray(keywords) && keywords.length
          ? keywords.map((keyword: string) => keyword.trim()).filter(Boolean)
          : [trimmedTitle.toLowerCase(), 'coloring pages', 'kids', 'printable'],
      featured: Boolean(featured),
    });

    return NextResponse.json({
      success: true,
      data: { slug },
      message: 'Category added successfully',
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

    console.error('Error adding category:', error);

    const message = error?.message || 'Failed to add category';
    const status = message.includes('already exists') ? 409 : 500;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}

