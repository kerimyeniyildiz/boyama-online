import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { getCategoryBySlug, normalizeSlug } from '@/lib/fileSystem';
import { requireAuth } from '@/lib/auth';

interface RouteParams {
  params: { slug: string; filename: string };
}

function toAbsolutePath(publicPath: string): string {
  const safePath = publicPath.replace(/^\/+/, '');
  return path.join(process.cwd(), 'public', safePath);
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

    const identifier = params.filename;

    const image = category.images.find((item) => {
      if (item.id === identifier) {
        return true;
      }
      const originalBase = path.basename(item.originalFilename, path.extname(item.originalFilename));
      const thumbnailBase = path.basename(item.thumbnailPath, path.extname(item.thumbnailPath));
      return originalBase === identifier || thumbnailBase === identifier;
    });

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Image not found',
        },
        { status: 404 }
      );
    }

    const absoluteOriginalPath = toAbsolutePath(image.originalPath);
    const absoluteThumbnailPath = toAbsolutePath(image.thumbnailPath);

    try {
      await fs.unlink(absoluteOriginalPath);
    } catch (error) {
      console.warn('Unable to delete original image:', absoluteOriginalPath, error);
    }

    try {
      await fs.unlink(absoluteThumbnailPath);
    } catch (error) {
      console.warn('Unable to delete thumbnail image:', absoluteThumbnailPath, error);
    }

    // Return updated category data to refresh UI
    const updatedCategory = await getCategoryBySlug(normalizedSlug);

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully',
      data: updatedCategory,
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

    console.error('Error deleting image:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete image',
      },
      { status: 500 }
    );
  }
}
