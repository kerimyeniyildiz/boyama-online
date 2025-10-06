import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { mkdir, writeFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileTypeFromBuffer } from 'file-type';
import { getCategoryBySlug, normalizeSlug } from '@/lib/fileSystem';
import { requireAuth } from '@/lib/auth';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB (reduced from 5MB)
const ALLOWED_MIME_TYPES = new Set(['image/png', 'image/jpeg']);
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

function buildBaseName(dirName: string, index: number): string {
  return `${dirName}-${String(index).padStart(3, '0')}`;
}

/**
 * Sanitize filename to prevent path traversal
 */
function sanitizeFilename(filename: string): string {
  // Remove path separators and null bytes
  return filename
    .replace(/[/\\]/g, '')
    .replace(/\0/g, '')
    .replace(/\.\./g, '')
    .trim();
}

/**
 * Validate image file using magic bytes
 */
async function validateImageFile(buffer: Buffer): Promise<{ valid: boolean; mimeType?: string }> {
  try {
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      return { valid: false };
    }

    if (!ALLOWED_MIME_TYPES.has(fileType.mime)) {
      return { valid: false };
    }

    // Additional validation: try to read with Sharp
    try {
      const metadata = await sharp(buffer).metadata();

      // Check dimensions are reasonable
      if (!metadata.width || !metadata.height) {
        return { valid: false };
      }

      if (metadata.width > 10000 || metadata.height > 10000) {
        return { valid: false };
      }

      return { valid: true, mimeType: fileType.mime };
    } catch (error) {
      return { valid: false };
    }
  } catch (error) {
    console.error('File validation error:', error);
    return { valid: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    requireAuth();

    const formData = await request.formData();
    const file = formData.get('file');
    const categoryParam = formData.get('category');

    // Check if file exists (works in both browser and Node.js)
    if (!file || typeof file === 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'No file provided',
        },
        { status: 400 }
      );
    }

    if (typeof categoryParam !== 'string' || !categoryParam.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'No category provided',
        },
        { status: 400 }
      );
    }

    // Get file as Blob (compatible with both File and Blob)
    const fileBlob = file as Blob;

    // Check file size
    if (fileBlob.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        },
        { status: 400 }
      );
    }

    // Get file buffer
    const buffer = Buffer.from(await fileBlob.arrayBuffer());

    // Validate file using magic bytes
    const validation = await validateImageFile(buffer);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid image file. Only PNG and JPEG files are allowed.',
        },
        { status: 400 }
      );
    }

    // Sanitize and validate category
    const normalizedSlug = normalizeSlug(categoryParam);
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

    // Build safe paths
    const dirName = normalizedSlug.replace(/-coloring-pages$/i, '');
    const baseDir = path.join(process.cwd(), 'public', 'coloring-pages', dirName);
    const originalDir = path.join(baseDir, 'original');
    const thumbnailDir = path.join(baseDir, 'thumbnails');

    // Ensure directories exist
    await mkdir(originalDir, { recursive: true });
    await mkdir(thumbnailDir, { recursive: true });

    // Determine file extension from validated mime type
    const extension = validation.mimeType === 'image/png' ? '.png' : '.jpg';

    // Find next available index
    const existingIndices = category.images.map((image) => {
      const match = image.originalFilename.match(/-(\d+)\.[^.]+$/);
      return match ? parseInt(match[1], 10) : 0;
    });

    let nextIndex = (existingIndices.length ? Math.max(...existingIndices) : 0) + 1;
    let baseName = buildBaseName(dirName, nextIndex);
    let originalFilename = `${baseName}${extension}`;

    // Ensure filename is unique
    while (fs.existsSync(path.join(originalDir, originalFilename))) {
      nextIndex += 1;
      baseName = buildBaseName(dirName, nextIndex);
      originalFilename = `${baseName}${extension}`;
    }

    // Save original file
    const originalPath = path.join(originalDir, originalFilename);
    await writeFile(originalPath, buffer);

    // Generate thumbnail
    const thumbnailFilename = `${baseName}.webp`;
    const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(thumbnailPath);

    // Get updated category
    const updatedCategory = await getCategoryBySlug(normalizedSlug);

    // Revalidate category page and homepage
    revalidatePath(`/${normalizedSlug}`);
    revalidatePath('/');

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
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

    console.error('Upload error:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);

    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to upload file',
      },
      { status: 500 }
    );
  }
}
