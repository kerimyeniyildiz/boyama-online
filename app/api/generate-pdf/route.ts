import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import sharp from 'sharp';

function resolveImagePath(imageUrl: string): string {
  const trimmed = imageUrl.trim();
  const withoutBase = trimmed.replace(/^\/+/, '');

  if (!withoutBase.startsWith('coloring-pages/')) {
    throw new Error('Invalid image path');
  }

  return path.join(process.cwd(), 'public', withoutBase);
}

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, filename } = await request.json();

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Image URL is required',
        },
        { status: 400 }
      );
    }

    const fullImagePath = resolveImagePath(imageUrl);

    await fs.access(fullImagePath);

    const metadata = await sharp(fullImagePath).metadata();
    const { width = 800, height = 600, format } = metadata as { width?: number; height?: number; format?: string };

    // Lossless when possible: if source is PNG, return PNG; otherwise return JPEG
    let mime = 'image/png';
    let b64: string;
    if ((format || '').toLowerCase() === 'png') {
      const png = await sharp(fullImagePath).png({ compressionLevel: 0 }).toBuffer();
      b64 = png.toString('base64');
      mime = 'image/png';
    } else {
      const jpeg = await sharp(fullImagePath).jpeg({ quality: 95, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
      b64 = jpeg.toString('base64');
      mime = 'image/jpeg';
    }

    return NextResponse.json({
      success: true,
      data: {
        imageData: `data:${mime};base64,${b64}`,
        width,
        height,
        filename: filename || 'coloring-page.pdf',
        mime,
      },
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') {
      return NextResponse.json(
        {
          success: false,
          error: 'Image file not found',
        },
        { status: 404 }
      );
    }

    console.error('Error generating PDF data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process image for PDF generation',
      },
      { status: 500 }
    );
  }
}
